from abc import ABC, abstractmethod, ABCMeta
from functools import cached_property
from dataclasses import dataclass
from logging import getLogger
from pathlib import Path
from typing import Literal, Optional, Union, List, Self
from datetime import datetime

import requests

from helpers.settings import Settings, get_settings
from pipelines.utils import watch
from helpers.mapbox_uploader import uploadToMapbox
from helpers.utils import writeReadGCP

from helpers.strapi import Strapi


logger = getLogger(__name__)

LOGGER_LVLS = {
    "pending": logger.info,
    "running": logger.info,
    "finish": logger.info,
    "dead": logger.error,
}
STATUSES = Literal["pending", "running", "finish", "dead"]
STEPS = Literal["download", "transform", "load"]

TYPES = Literal["api_descriptor", "cloudStorage_descriptor", "mapbox_descriptor", "file_descriptor"]


@dataclass
class Status:
    status: Union[None, STATUSES] = None
    step: Union[None, STEPS] = None
    message: Union[None, str] = None
    timestamp: Union[None, str] = None


@dataclass
class Metadata:
    name: str
    source: str
    description: Optional[str] = None
    license: Optional[str] = None
    citation: Optional[str] = None
    version: Optional[str] = None
    tags: Optional[List[str]] = None


# TODO: improve this descriptors
@dataclass
class GenericDescriptor:
    file_name: str
    destination_path: Path

    @cached_property
    def file_path(self: Self) -> Path:
        return self.destination_path.joinpath(self.file_name)

    @cached_property
    def file_extension(self: Self) -> str:
        return self.file_path.suffix


class APIDescriptor(GenericDescriptor):
    type: Literal["api_descriptor"] = "api_descriptor"
    body: Optional[dict] = None
    params: Optional[dict] = None
    headers: Optional[dict | List[dict]] = None


class CloudStorageDescriptor(GenericDescriptor):
    type: Literal["cloudStorage_descriptor"] = "cloudStorage_descriptor"
    local_path: Path
    remote_path: Path
    provider: Literal["gcs", "s3"]
    bucket: str
    operation: Literal["r", "w"]

    @cached_property
    def file_path(self: Self) -> Path:
        return self.local_path.joinpath(self.file_name)

    @cached_property
    def cloud_path(self: Self) -> str:
        return f"{self.provider}:{self.bucket}/{self.remote_path}/{self.file_name}"


class MapboxDescriptor(GenericDescriptor):
    type: Literal["mapbox_descriptor"] = "mapbox_descriptor"
    file_path: Path
    destination_name: str

    @cached_property
    def file_name(self: Self) -> str:
        return self.file_path.name

    @cached_property
    def file_extension(self: Self) -> str:
        return self.file_path.suffix


class FileDescriptor(GenericDescriptor):
    type: Literal["file_descriptor"] = "file_descriptor"

    @cached_property
    def file_name(self) -> str:
        return self.file_path.name

    @cached_property
    def file_extension(self) -> str:
        return self.file_path.suffix


class StrapiDescriptor(GenericDescriptor):
    type: Literal["strapi_descriptor"] = "strapi_descriptor"
    collection: str

    @cached_property
    def file_name(self) -> str:
        return self.file_path.name

    @cached_property
    def file_extension(self) -> str:
        return self.file_path.suffix


@dataclass
class Dataset:
    name: str
    descriptor: (
        APIDescriptor
        | FileDescriptor
        | CloudStorageDescriptor
        | MapboxDescriptor
        | StrapiDescriptor
    )


# TODO: add a notification system in the pipeline
class BasePipe(ABC):
    """Base class for all pipelines"""

    settings: Settings = get_settings()
    status: Status = Status()
    force_clean: bool = False
    depends_on: Union[None, List[str]] = None

    @property
    @abstractmethod
    def input_data(self) -> Union[Dataset, List[Dataset]]:
        pass

    @property
    @abstractmethod
    def output_data(self) -> Union[Dataset, List[Dataset]]:
        pass

    @property
    @abstractmethod
    def pipeline_name(self: Self) -> str:
        pass

    @abstractmethod
    def extract(self: Self) -> Self:
        return self

    @abstractmethod
    def transform(self: Self) -> Self:
        return self

    @abstractmethod
    def load(self: Self) -> Self:
        return self

    def execute(self: Self) -> Self:
        """Run the pipeline"""
        return self.extract().transform().load()

    def _get_input_data(self) -> List[Dataset]:
        if not isinstance(self.input_data, list):
            return [self.input_data]
        return self.input_data

    def _get_output_data(self) -> List[Dataset]:
        if not isinstance(self.output_data, list):
            return [self.output_data]
        return self.output_data

    def set_status(self, status: STATUSES, message: str) -> None:
        self.status.status = status
        self.status.message = message
        self.status.timestamp = str(datetime.now())
        log = f"Pipeline {self.pipeline_name} {status} at {self.status.timestamp}: {message}"
        LOGGER_LVLS[status](log)

    def notify(self, message: str) -> None:
        try:
            headers = {
                "Markdown": "yes",
                "Priority": "5",
                "Authorization": "Bearer {}".format(self.settings.NOTIFY_JWT),
            }
            r = requests.post(
                self.settings.NOTIFY_URL, data=message.encode("utf-8"), headers=headers
            )
            r.raise_for_status()
        except Exception as e:
            logger.error(e)


class IntermediateBasePipe(BasePipe, metaclass=ABCMeta):
    """
    This is a base class for intermediate pipelines. It is used to
    generate intermediate files that are used in the tiles or in the preprocess
    pipeline, that require a common source file.

    """

    @watch
    def load(self):
        self.set_status("running", f"Uploading data to {self.settings.GCS_BUCKET}")

        # TODO: review if this is the most performant way to do this
        for data in self._get_output_data():
            if data.descriptor.type != "cloudStorage_descriptor":
                raise EncodingWarning("only cloudStorage_descriptor is supported")

            writeReadGCP(
                credentials=self.settings.GCS_KEYFILE_JSON,
                bucket_name=self.settings.GCS_BUCKET,
                blob_name=data.descriptor.remote_path.as_posix(),
                file=data.descriptor.file_path,
                operation="w",
            )
        return self

class VTBasePipe(BasePipe, metaclass=ABCMeta):
    """
    Base class for vector tiles pipelines.
    It gets the data prepared in the intermediate pipelines and generates the vector tiles.
    Finally, it uploads the vector tiles to mapbox.
    """

    @watch
    def extract(self: Self) -> Self:
        self.set_status("running", f"Download data from GCP {self.settings.GCS_BUCKET}")

        for data in self._get_input_data():

            if data.descriptor.type != "cloudStorage_descriptor":
                raise EncodingWarning("only cloudStorage_descriptor is supported")

            writeReadGCP(
                credentials=self.settings.GCS_KEYFILE_JSON,
                bucket_name=self.settings.GCS_BUCKET,
                blob_name=data.descriptor.remote_path.as_posix(),
                file=data.descriptor.local_path,
                operation="r",
            )
        return self

    @watch
    def load(self: Self) -> Self:
        self.set_status("running", f"Uploading tileset to Mapbox {self.settings.MAPBOX_USER}")

        for data in self._get_output_data():

            if data.descriptor.type != "mapbox_descriptor":
                raise EncodingWarning("only mapbox_descriptor is supported")

            uploadToMapbox(
                data.descriptor.file_path,
                data.descriptor.destination_name,
                self.settings.MAPBOX_USER,
                self.settings.MAPBOX_TOKEN,
            )

        return self


class PreprocessBasePipe(BasePipe, metaclass=ABCMeta):
    """Base class for preprocess pipelines that generate statistics using the platform."""

    @watch
    def extract(self: Self) -> Self:
        self.set_status("running", f"Download data from GCP {self.settings.GCS_BUCKET}")

        for data in self._get_input_data():

            if data.descriptor.type != "cloudStorage_descriptor":
                raise EncodingWarning("only cloudStorage_descriptor is supported")

            writeReadGCP(
                credentials=self.settings.GCS_KEYFILE_JSON,
                bucket_name=self.settings.GCS_BUCKET,
                blob_name=data.descriptor.remote_path.as_posix(),
                file=data.descriptor.local_path,
                operation="r",
            )
        return self

    @watch
    def load(self: Self) -> Self:
        self.set_status("running", "Uploading data to Strapi...")

        strapi_loader = Strapi(url=self.settings.STRAPI_URL, jwt=self.settings.STRAPI_JWT)

        output_data = self._get_output_data()

        if any(data.descriptor.type != "strapi_descriptor" for data in output_data):
            raise EncodingWarning("only strapi_descriptor is supported")

        collections = set(data.descriptor.collection for data in output_data)

        for collection in collections:
            strapi_loader.deleteCollectionData(collection)

        for data in output_data:
            strapi_loader.importCollectionData(
                data.descriptor.collection, data.descriptor.file_path
            )

        return self
