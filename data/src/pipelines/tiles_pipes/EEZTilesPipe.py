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


class EEZTilesPipe(VTBasePipe):
    pipeline_name = "eez_tiles"
    depends_on = ["eez_intermediate"]
    extract_params = ExtractParams(
        source="eez/eez_intermediate.zip",
        output_path="data/eez_intermediate",
    )
    transform_params = TransformParams(
        files="eez_intermediate.shp",
        columns=["GEONAME", "POL_TYPE", "ISO_SOV1", "ISO_SOV2", "ISO_SOV3"],
    )
    load_params = LoadParams(destination_name="eez_v11-4pg8or")

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

        Mapshaper(8).input([file.as_posix()]).filter_fields(fields=keep_fields).output(
            file.as_posix(), force=True
        ).execute()

        self.output_params.input_path = mbtileGeneration(file)
        return self
