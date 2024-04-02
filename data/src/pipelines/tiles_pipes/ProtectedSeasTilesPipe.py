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


class ProtectedSeasTilesPipe(VTBasePipe):
    pipeline_name = "protectedseas_tiles"
    depends_on = ["protectedseas_intermediate"]
    extract_params = ExtractParams(
        source="protectedseas_intermediate/protectedseas_intermediate.zip",
        output_path="data/protectedseas_intermediate",
    )
    transform_params = TransformParams(
        files="protectedseas_intermediate.shp",
        columns=[
            "site_id",
            "site_name",
            "total_area",
            "geometry",
            "FPS_cat",
        ],
    )
    load_params = LoadParams(destination_name="protected_seas")

    def __init__(self, force_clean: bool = False) -> None:
        super().__init__()
        self.folder_path = self.settings.DATA_DIR.joinpath(self.pipeline_name)
        self.force_clean = force_clean
        self.settings.validate_config()

    def transform(self):
        unziped_folder = unpack_archive(self.transform_params.input_path)

        file = unziped_folder.joinpath(self.transform_params.files)
        keep_fields = (
            ",".join(self.transform_params.columns)
            if isinstance(self.transform_params.columns, list)
            else self.transform_params.columns
        )
        # simplify and clean the data for visual purposes
        Mapshaper(16).input([file.as_posix()]).filter_fields(fields=keep_fields).clean(
            allow_overlaps=True, rewind=True
        ).clean(allow_overlaps=True, rewind=True).simplify("dp 10% keep-shapes planar").clean(
            allow_overlaps=True
        ).output(
            file.as_posix(), force=True
        ).execute()

        self.output_params.input_path = mbtileGeneration(file)
        return self
