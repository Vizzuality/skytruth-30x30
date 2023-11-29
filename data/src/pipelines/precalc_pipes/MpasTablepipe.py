from logging import getLogger
from typing import Dict, Union
from pathlib import Path
import pandas as pd
import geopandas as gpd

from pipelines.utils import load_regions
from pipelines.output_schemas import ProtectedAreaExtentSchema
from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from mapshaper import Mapshaper

logger = getLogger(__name__)


class MpaAtlasStatsPipe(PreprocessBasePipe):
    pipeline_name = "MpaAtlas_stats_precalc"
    depends_on = ["mpa_intermediate"]
    extract_params = ExtractParams(
        source="mpas/mpas_intermediate.zip",
        output_path="data/mpas_intermediate",
    )
    transform_params = TransformParams(
        files="mpas_intermediate.shp",
        columns=["location_id", "location_name", "location_type", "total_marine_area"],
    )
    load_params = LoadParams(destination_name=["locations", "region_locations"])

    def extract(self):
        return super().extract()

    def transform(self):
        return self
