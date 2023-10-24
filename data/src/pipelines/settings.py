import logging
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    MAPBOX_USER: str
    MAPBOX_TOKEN: str
    DATA_DIR: Path

    # model_config = SettingsConfigDict(env_file=".env")

    def validate_config(self):
        if not self.MAPBOX_USER:
            raise ValueError("MAPBOX_USER is not set")
        if not self.MAPBOX_TOKEN:
            raise ValueError("MAPBOX_TOKEN is not set")

        return self.validate_dir()

    def validate_dir(self):
        logger.debug(self.DATA_DIR)

        if not self.DATA_DIR:
            raise ValueError("DATA_DIR is not set in the env file")

        return True
