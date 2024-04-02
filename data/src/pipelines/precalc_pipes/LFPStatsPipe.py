from logging import getLogger
from typing import Dict, Union
from pathlib import Path
import pandas as pd
import geopandas as gpd

from data_commons.loader import load_regions
from helpers.mapshaper import Mapshaper
from pipelines.output_schemas import FPLSchema
from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)


logger = getLogger(__name__)


class LFPStatsPipe(PreprocessBasePipe):
    pipeline_name = "lfp_precalc"
    depends_on = ["protectedseas_intermediate"]
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
        protectedseas_intermediate = gpd.read_file(
            protectedseas_folder.joinpath(
                "protectedseas_intermediate", "protectedseas_intermediate.shp"
            )
        )

        table = (
            protectedseas_intermediate.pipe(calculate_area)
            .pipe(calculate_global_area, gby_col=["FPS_cat"], iso_column="iso")
            .pipe(separate_parent_iso, iso_column="iso")
            .replace(
                {
                    "iso": {
                        "COK": "NZL",
                        "IOT": "GBR",
                        "NIU": "NZL",
                        "SHN": "GBR",
                        "SJM": "NOR",
                        "UMI": "USA",
                        "NCL": "FRA",
                    }
                }
            )
            .pipe(add_region_iso, iso_column="iso")
            .pipe(protectedseas_calculation, gby_col=["FPS_cat"])
            .pipe(fix_monaco, iso_column="iso", area_column="area_km2")
            .pipe(
                output,
                iso_column="iso",
                rep_d={
                    "FPS_cat": {
                        "highly": 1,
                        "moderately": 2,
                        "less": 3,
                    }
                },
                rename={"FPS_cat": "fishing_protection_level", "area_km2": "area"},
                drop_cols=["iso"],
            )
        )
        FPLSchema(table).to_csv(protectedseas_folder.joinpath("lfp.csv"), index=True)

        return self
