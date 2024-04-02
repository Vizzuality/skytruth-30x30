from shutil import unpack_archive
from logging import getLogger

from pipelines.base_pipe import (
    VTBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from helpers.tippcanoe import mbtileGeneration
from helpers.mapshaper import Mapshaper

logger = getLogger(__name__)


class RegionsTilesPipe(VTBasePipe):
    pipeline_name = "regions_tiles"
    depends_on = ["eez_intermediate"]
    extract_params = ExtractParams(
        source="eez/eez_intermediate.zip",
        output_path="data/eez_intermediate",
    )
    transform_params = TransformParams(
        files="eez_intermediate.shp",
    )
    load_params = LoadParams(destination_name="regions")

    def __init__(self, force_clean: bool = False) -> None:
        super().__init__()
        self.folder_path = self.settings.DATA_DIR.joinpath(self.pipeline_name)
        self.force_clean = force_clean
        self.settings.validate_config()

    def transform(self):
        unziped_folder = unpack_archive(self.transform_params.input_path)

        file = unziped_folder.joinpath(self.transform_params.files)

        Mapshaper(16).input([file.as_posix()]).dissolve2(fields="region_id").output(
            unziped_folder.joinpath(f"{file.stem}.json").as_posix(), force=True, format="geojson"
        ).execute()

        self.output_params.input_path = mbtileGeneration(file)
        return self
