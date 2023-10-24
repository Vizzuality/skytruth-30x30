from abc import ABC, abstractmethod, ABCMeta
from dataclasses import dataclass
from pipelines.settings import Settings
from mapbox_uploader import uploadToMapbox
from pathlib import Path
from functools import lru_cache
from typing import Optional, TypeVar, Union, List
from logging import getLogger

# import requests
# import time


logger = getLogger(__name__)


@lru_cache()
def get_settings():
    return Settings()


@dataclass
class DownloadParams:
    url: str
    output_name: Optional[Path] = None
    output_path: Optional[Path] = None
    body: Optional[dict] = None
    params: Optional[dict] = None
    headers: Optional[dict] = None


@dataclass
class TransformParams:
    input_path: Optional[Path] = None
    files: Optional[Union[str, List[str]]] = None
    columns: Optional[Union[str, List[str]]] = None


@dataclass
class OutputParams:
    input_path: Optional[Path] = None
    destination_name: Optional[str] = None


_Self = TypeVar("_Self", bound="BasePipe")


# TODO: add a notification system in the pipeline
class BasePipe(ABC):
    settings = get_settings()
    force_clean: bool = False

    @property
    @abstractmethod
    def pipeline_name(self: _Self) -> str:
        pass

    @property
    @abstractmethod
    def download_params(self: _Self) -> DownloadParams:
        pass

    @property
    @abstractmethod
    def transform_params(self: _Self) -> TransformParams:
        pass

    @property
    @abstractmethod
    def output_params(self: _Self) -> OutputParams:
        pass

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
        try:
            logger.info(f"Running {self.pipeline_name} pipeline")
            self.extract().transform().load()
            # self.__notify(f"Pipeline {self.pipeline_name} finished")

        except ValueError as e:
            # self.__notify(f"Pipeline {self.pipeline_name} failed at {time.now()}")
            raise e

    def __notify(self, message: str) -> None:
        # try:
        # headers = { "Markdown": "yes", "Priority": "5", "Authorization": "Bearer {}".format(self.settings.notification_token)}
        # r = requests.post(self.settings.notification_url,
        # data=message.encode("utf-8"),
        # headers=headers))
        # r.raise_for_status()
        # except Exception as e:
        #     logger.error(e)
        #     pass
        pass


class VTBasePipe(BasePipe, metaclass=ABCMeta):
    def load(self):
        uploadToMapbox(
            self.output_params.input_path,
            self.output_params.destination_name,
            self.settings.MAPBOX_USER,
            self.settings.MAPBOX_TOKEN,
        )
        return self
