from pipelines.base_pipe import (
    VTBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)

from shutil import unpack_archive
from tippcanoe import mbtileGeneration
from mapshaper import Mapshaper
from logging import getLogger

logger = getLogger(__name__)


class MpasTilesPipe(VTBasePipe):
    pipeline_name = "mpa_tiles"
    depends_on = ["mpa_intermediate"]
    extract_params = ExtractParams(
        source="mpa/mpa_intermediate.zip",
        output_path="data/mpa_intermediate",
    )
    transform_params = TransformParams(
        files="mpa_intermediate.shp",
        columns=[
            "WDPAID",
            "PA_DEF",
            "NAME",
            "STATUS",
            "STATUS_YR",
            "PARENT_ISO",
            "MANG_PLAN",
        ],
    )
    load_params = LoadParams(destination_name="mpas_wdpa")

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

        Mapshaper(8).input([file.as_posix()]).simplify("dp interval=100").clean(
            allow_overlaps=True, rewind=True
        ).filter_fields(fields=keep_fields).output(
            file.as_posix(), force=True
        ).execute()

        self.output_params.input_path = mbtileGeneration(file)
        return self
