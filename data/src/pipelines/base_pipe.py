from abc import ABC, abstractmethod, ABCMeta
from dataclasses import dataclass
from logging import getLogger
from pathlib import Path
from typing import Literal, Optional, TypeVar, Union, List, ClassVar
from datetime import datetime

# import requests

from pipelines.settings import Settings, get_settings
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


@dataclass
class ExtractParams:
    source: str | Path
    output_path: Optional[Path] = None
    output_name: Optional[str] = None
    body: Optional[dict] = None
    params: Optional[dict] = None
    headers: Optional[dict | List[dict]] = None


@dataclass
class TransformParams:
    input_path: Optional[Path | List[Path]] = None
    files: Optional[Union[str, List[str]]] = None
    columns: Optional[Union[str, List[str]]] = None
    rename: Optional[dict] = None


@dataclass
class LoadParams:
    input_path: Optional[Path | List[Path]] = None
    destination_name: Optional[str] = None


@dataclass
class Status:
    status: Union[None, Literal["pending", "running", "finish", "dead"]] = None
    step: Union[None, Literal["download", "transform", "load"]] = None
    message: Union[None, str] = None
    timestamp: Union[None, str] = None


_Self = TypeVar("_Self", bound="BasePipe")


# TODO: add a notification system in the pipeline
class BasePipe(ABC):
    """Base class for all pipelines"""

    settings: Settings = get_settings()
    status: Status = Status()
    force_clean: bool = False
    depends_on: Union[None, List[str]] = None

    @property
    @abstractmethod
    def extract_params(self) -> Union[ExtractParams, List[ExtractParams]]:  # type: ignore
        pass

    @property
    @abstractmethod
    def transform_params(self) -> TransformParams:  # type: ignore
        pass

    @property
    @abstractmethod
    def load_params(self) -> LoadParams:  # type: ignore
        pass

    @property
    @abstractmethod
    def pipeline_name(self) -> str:  # type: ignore
        pass

    pipeline_name: ClassVar[str]
    load_params: ClassVar[LoadParams]
    transform_params: ClassVar[TransformParams]
    extract_params: ClassVar[Union[ExtractParams, List[ExtractParams]]]

    @abstractmethod
    def extract(self: _Self) -> _Self:
        return self

    @abstractmethod
    def transform(self: _Self) -> _Self:
        return self

    @abstractmethod
    def load(self: _Self) -> _Self:
        return self

    def execute(self) -> None:
        """Run the pipeline"""
        self.extract().transform().load()
        return self

    def set_status(self, status: str, message: str) -> None:
        self.status.status = status
        self.status.message = message
        self.status.timestamp = str(datetime.now())
        log = f"Pipeline {self.pipeline_name} {status} at {self.status.timestamp}: {message}"
        LOGGER_LVLS[status](log)

    def notify(self, message: str) -> None:
        # try:
        #     headers = { "Markdown": "yes", "Priority": "5", "Authorization": "Bearer {}".format(self.settings.notification_token)}
        #     r = requests.post(self.settings.notification_url,
        #     data=message.encode("utf-8"),
        #     headers=headers))
        #     r.raise_for_status()
        # except Exception as e:
        #     logger.error(e)
        #     pass
        pass


class IntermediateBasePipe(BasePipe, metaclass=ABCMeta):
    """
    This is a base class for intermediate pipelines. It is used to
    generate intermediate files that are used in the tiles or in the preprocess
    pipeline, that require a common source file.

    """

    @watch
    def load(self):
        writeReadGCP(
            credentials=self.settings.GCS_KEYFILE_JSON,
            bucket_name=self.settings.GCS_BUCKET,
            blob_name=self.load_params.destination_name
            if self.load_params.destination_name
            else self.pipeline_name,
            file=self.load_params.input_path[0]
            if isinstance(self.load_params.input_path, list)
            else self.load_params.input_path,  # type: ignore
            operation="w",
        )
        return self


class VTBasePipe(BasePipe, metaclass=ABCMeta):
    """Base class for vector tiles pipelines. It gets the data prepared in the intermediate pipelines and generates the vector tiles. finally it uploads the vector tiles to mapbox."""

    @watch
    def extract(self: _Self) -> _Self:
        self.set_status("running", "Download from GCP")
        writeReadGCP(
            credentials=self.settings.GCS_KEYFILE_JSON,
            bucket_name=self.settings.GCS_BUCKET,
            blob_name=self.extract_params.source,
            file=self.extract_params.output_path,
            operation="r",
        )
        return self

    @watch
    def load(self):
        uploadToMapbox(
            self.load_params.input_path,
            self.load_params.destination_name,
            self.settings.MAPBOX_USER,
            self.settings.MAPBOX_TOKEN,
        )
        return self


class PreprocessBasePipe(BasePipe, metaclass=ABCMeta):
    """This is a base class for preprocess pipelines, those that generates the statistics that uses the platform. It gets the data prepared in the intermediate pipelines and generates the statistics."""

    @watch
    def extract(self):
        writeReadGCP(
            credentials=self.settings.GCS_KEYFILE_JSON,
            bucket_name=self.settings.GCS_BUCKET,
            blob_name=self.extract_params.source,
            file=self.extract_params.output_path,
            operation="r",
        )
        return self

    @watch
    def load(self):
        # Strapi()
        return self
