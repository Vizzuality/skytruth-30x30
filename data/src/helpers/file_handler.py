from typing import Literal, get_args
from pathlib import Path
from functools import cached_property

from helpers.settings import get_settings

mysettings = get_settings()

STEPS = Literal["stats", "tiles", "preprocess", "onthefly"]
FORMATS = Literal["geojson", "shp", "csv", "mbtiles", "zip"]


class FileConventionHandler:

    def __init__(
        self,
        pipe: str,
        data_base_dir: Path = mysettings.DATA_DIR,
        structure: dict[str, list] | None = None,
    ):

        self.base_dir: Path = data_base_dir
        self.pipe: str = pipe
        self.structure: dict[str, list] = structure if structure else self.__set_structure()
        self.__make_structure()

    @cached_property
    def pipe_path(self) -> Path:
        return self.base_dir.joinpath(self.pipe)

    @cached_property
    def pipe_raw_path(self) -> Path:
        return self.pipe_path.joinpath("raw")

    @cached_property
    def processed_path(self) -> Path:
        return self.pipe_path.joinpath("processed")

    def get_processed_step_path(
        self,
        step: STEPS,
    ) -> Path:
        return self.processed_path.joinpath(step)

    def get_temp_file_path(
        self,
        step: STEPS,
    ) -> Path:
        return self.pipe_raw_path.joinpath(f"temp_{step}")

    def get_step_fmt_file_path(self, step: STEPS, fmt: FORMATS, parent: bool = False) -> Path:
        base = self.processed_path if parent else self.get_processed_step_path(step)

        return base.joinpath(f"{self.pipe}_{step}.{fmt}")

    def get_remote_path(
        self,
        step: STEPS,
    ) -> str:
        return f"vizzuality_processed_data/{self.pipe}/{step}/{self.pipe}_{step}.zip"

    def __make_structure(self):
        self.pipe_path.mkdir(exist_ok=True)
        set_folders = set([item for row in self.structure.values() for item in row])

        for folder in set_folders:
            self.pipe_path.joinpath(folder).mkdir(exist_ok=True, parents=True)

    def __set_structure(self):
        steps = get_args(STEPS)
        temp_steps = [f"raw/temp_{step}" for step in steps]
        output_steps = [f"processed/{step}" for step in steps]

        return {
            "input": ["raw"],
            "temp": temp_steps,
            "output": output_steps,
        }
