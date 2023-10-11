import zipfile
import os
import requests
from logging import getLogger
from pathlib import Path
from typing import Union
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = getLogger(__name__)


class Settings(BaseSettings):
    app_name: str = "skytruth_30x30_data_pipelines"
    MAPBOX_USER: str
    MAPBOX_TOKEN: str
    data_directory: Path = Path(os.getcwd()).parents[0].joinpath("/data")

    # model_config = SettingsConfigDict(env_file=".env")

    def validate_config(self):
        if not self.MAPBOX_USER:
            raise ValueError("MAPBOX_USER is not set")
        if not self.MAPBOX_TOKEN:
            raise ValueError("MAPBOX_TOKEN is not set")

        self.validate_dir()

        return True

    def validate_dir(self):
        if not self.data_directory or not self.data_directory.exists():
            raise ValueError("download_dir is not set")

        assert (
            self.data_directory.absolute().as_posix() == "/home/mamabauser/data"
        ), f"{self.data_directory} is not the correct directory"

        return True


def downloadFile(url: str, output_path: Union[Path, None] = None) -> Path:
    """
    Download a file from a url.

    Args:
        url (str): The url to the file.
        output_path (Union[Path, None], optional): The path to the output file.
                                The default is None.
    Returns:
        Path: The path to the output file.
    """
    try:
        if not output_path:
            output_path = Path(os.getcwd())

        file = url.split("=")[-1]
        output_file = output_path.joinpath(file)
        if output_file.exists():
            logger.debug(f"File {output_file} already exists.")
            return output_file

        logger.debug(f"Downloading file in {output_file}")

        r = requests.get(url, allow_redirects=True)
        r.raise_for_status()
        with open(output_file, "wb") as f:
            f.write(r.content)
        logger.info("Download Finish.")
        return output_file

    except Exception as e:
        logger.error(e)
        return None


def unzipFile(source_path: Path, output_path: Union[Path, None] = None) -> Path:
    """unzip a file

    Args:
        source_path (Path): The path to the file.
        output_path (Union[Path, None], optional): The path to the output file. The default is None.

    Returns:
        Path: The path to the output file.
    """
    with zipfile.ZipFile(source_path, "r") as zip_ref:
        zip_ref.extractall(output_path)

    return output_path
