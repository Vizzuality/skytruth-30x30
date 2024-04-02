from logging import getLogger
from typing import Dict, Union
from pathlib import Path
import pandas as pd
import geopandas as gpd


from data_commons.loader import load_regions
from pipelines.output_schemas import StablishmentStageSchema
from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)

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
        mpa_intermediate = gpd.read_file(
            self.transform_params.files.joinpath("mpa_intermediate", "mpa_intermediate.shp")
        )
        table = (
            mpa_intermediate.pipe(calculate_area)
            .pipe(calculate_global_area, gby_col=["establishm"], iso_column="location_i")
            .pipe(separate_parent_iso)
            .replace(
                {
                    "location_i": {
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
            .pipe(add_region_iso, iso_column="location_i")
            .pipe(mpaatlas_calculation, gby_col=["establishm"])
            .pipe(fix_monaco, iso_column="location_i", area_column="area_km2")
            .pipe(
                output,
                iso_column="location_i",
                rep_d={
                    "establishm": {
                        "actively managed": 4,
                        "implemented": 6,
                        "designated": 5,
                        "proposed or committed": 3,
                        "unknown": 1,
                    }
                },
                rename={"establishm": "mpaa_establishment_stage", "area_km2": "area"},
                drop_cols=["location_i"],
            )
        ).assign(year=2023, protection_status=1)

        StablishmentStageSchema(table[~table.location.isna()]).to_csv(
            mpaatlas_folder.joinpath("mpaatlas_stablishment.csv"), index=True
        )

        return self
