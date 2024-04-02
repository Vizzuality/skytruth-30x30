from logging import getLogger
from typing import Dict, Union
from pathlib import Path
import pandas as pd
import geopandas as gpd

from data_commons.loader import load_regions
from pipelines.output_schemas import MPAsSchema
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
            mpa_folder.joinpath("mpa_intermediate", "mpa_intermediate.shp")
        )
        mpa_intermediate.replace(
            {
                "PARENT_ISO": {
                    "COK": "NZL",
                    "IOT": "GBR",
                    "NIU": "NZL",
                    "SHN": "GBR",
                    "SJM": "NOR",
                    "UMI": "USA",
                    "NCL": "FRA",
                }
            }
        ).pipe(
            output,
            iso_column="PARENT_ISO",
            rep_d={
                "STATUS": {
                    "Adopted": 4,
                    "implemented": 6,
                    "Established": 6,
                    "Designated": 5,
                    "Proposed": 3,
                    "Inscribed": 3,
                    "unknown": 1,
                },
                "PA_DEF": {"0": 2, "1": 1},
                "STATUS_YR": {0: pd.NA},
            },
            rename={
                "PARENT_ISO": "iso",
                "PA_DEF": "protection_status",
                "REP_M_AREA": "area",
                "STATUS_YR": "year",
                "WDPA_PID": "wdpaid",
                "NAME": "name",
                "STATUS": "mpaa_establishment_stage",
            },
            drop_cols=["geometry", "WDPAID", "iso"],
        ).astype(
            {"year": "Int64"}
        )

        prev = 0
        for idx, size in enumerate(range(5000, len(test4.index) + 5000, 5000)):
            MPAsSchema(test4[(test4.index > prev) & (test4.index < size)]).to_csv(
                mpa_folder.joinpath(f"mpa_{idx}.csv"),
                index=True,
                encoding="utf-8",
            )
            prev = size
        return self
