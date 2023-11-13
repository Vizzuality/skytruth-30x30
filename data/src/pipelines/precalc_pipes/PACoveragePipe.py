from functools import lru_cache
from logging import getLogger
from pathlib import Path
import pandas as pd
import geopandas as gpd
import json
from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from mapshaper import Mapshaper

logger = getLogger(__name__)


class PACoveragePipe(PreprocessBasePipe):
    pipeline_name = "mpa_coverage_precalc"
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

    def transform(self):
        self.load_params.input_path = Path(f"{self.folder_path}/{self.pipeline_name}")
        # dissolve Mpas subtables
        for year in range(2000, 2021):
            Mapshaper(16)

        eez.drop(
            columns=list(
                set(eez.columns) - set([*self.transform_params.columns, "geometry"])
            )
        ).to_csv(
            f"{self.load_params.input_path}/{self.load_params.destination_name[0]}.csv",
            index=False,
        )
        # regions_location table
        regions_df = pd.DataFrame(
            [
                {"region_id": data["region_iso"], "location_id": iso}
                for data in load_regions()
                for iso in data["country_iso_3s"]
            ]
        )
        regions_df.to_csv(
            f"{self.load_params.input_path}/{self.load_params.destination_name[1]}.csv",
            index=False,
        )

        return self
