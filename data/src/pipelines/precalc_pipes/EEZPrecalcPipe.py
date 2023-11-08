from logging import getLogger
from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)


logger = getLogger(__name__)


class EEZPrecalcPipe(PreprocessBasePipe):
    pipeline_name = "eez_precalc"
    depends_on = ["eez_intermediate"]
    extract_params = ExtractParams(
        source="eez/eez_intermediate.zip",
        output_path="data/eez_intermediate",
    )
    transform_params = TransformParams(
        files="eez_v11.shp",
        columns=["GEONAME", "POL_TYPE", "ISO_SOV1", "ISO_SOV2", "ISO_SOV3"],
    )
    load_params = LoadParams(destination_name="locations")

    def transform(self):
        return self
