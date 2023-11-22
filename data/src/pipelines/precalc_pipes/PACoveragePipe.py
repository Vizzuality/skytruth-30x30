from logging import getLogger
from typing import Dict, Union
from pathlib import Path
import pandas as pd
import geopandas as gpd
from time import now

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


def execute_mapshaper(memory, input, year, output_folder):
    output_file = output_folder.joinpath(f"protected_dissolved_{year}.shp").as_posix()
    Mapshaper(memory).input([input]).filter(expression=f"'STATUS_YR<={year}'").dissolve2(
        fields="'PA_DEF,PARENT_ISO'", calc="'protectedAreasCount = count()'"
    ).explode().reproject(
        "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs"
    ).each(
        expression="cumSumProtectedArea=this.area/1000000"
    ).output(
        output_file
    ).execute()
    return output_file


def global_coverage_calculation(df: pd.DataFrame) -> pd.DataFrame:
    global_area = (
        df.groupby(["PA_DEF", "year", "PARENT_ISO"])
        .agg(
            {
                "cumSumProt": "sum",
                "protectedA": "first",
            }
        )
        .reset_index()
        .groupby(["PA_DEF", "year"])
        .sum()
        .reset_index()
        .assign(PARENT_ISO="GLOB")
    )
    return pd.concat(
        [
            df.replace(
                {
                    "PARENT_ISO": {
                        "COK": "NZL",
                        "IOT": "GBR",
                        "NIU": "NZL",
                        "SHN": "GBR",
                        "SJM": "NOR",
                        "UMI": "USA",
                    }
                }
            ),
            global_area,
        ],
        ignore_index=True,
    )


def separate_parent_iso(df: pd.DataFrame) -> pd.DataFrame:
    df["parent_iso"] = df["PARENT_ISO"].str.split(";")
    return df.explode("PARENT_ISO")


def aggregate_area(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby(["PA_DEF", "PARENT_ISO", "year"])
        .agg({"cumSumProt": "sum", "protectedA": "first"})
        .reset_index()
    )


def add_region_iso(df: pd.DataFrame) -> pd.DataFrame:
    regions = load_regions()

    def find_region_iso(iso: str) -> Union[str, None]:
        filtered_regions = list(filter(lambda x: iso in x["country_iso_3s"], regions.get("data")))
        return filtered_regions[0]["region_iso"] if len(filtered_regions) > 0 else None

    return df.assign(region=lambda row: row["PARENT_ISO"].apply(find_region_iso))


def region_coverage_calculation(df: pd.DataFrame):
    regions = (
        df.pipe(add_region_iso)
        .groupby(["PA_DEF", "region", "year"])
        .agg({"cumSumProt": "sum", "protectedA": "sum"})
        .reset_index()
    )
    return pd.concat(
        [df, regions.assign(PARENT_ISO=lambda row: row["region"]).drop(columns="region")],
        ignore_index=True,
    )


def output(df: pd.DataFrame, cols: Dict[str, str]) -> pd.DataFrame:
    locations_code = pd.read_csv(location_index, keep_default_na=False)
    return (
        df.join(locations_code.set_index("code"), on="PARENT_ISO", how="left")
        .replace({"PA_DEF": {"0": 2, "1": 1}})
        .rename(columns=cols)
        .drop(columns=["PARENT_ISO", "cumsum_area"])
        .assign(
            id=df.index + 1,
            cumSumProtectedArea=df.cumSumProt.round(2),
            protectedArea=(
                df.sort_values(by=["PARENT_ISO", "year", "PA_DEF"]).cumSumProt
                - df.sort_values(by=["PARENT_ISO", "year", "PA_DEF"])
                .groupby(["PA_DEF", "PARENT_ISO", "year"])
                .cumSumProt.shift(-1, fill_value=0)
                .reset_index(drop=True)
            ).round(2),
        )
        .set_index("id")
    )


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
        dissolved_folder = self.load_params.input_path.joinpath("timeseries")
        dissolved_folder.mkdir(parents=True, exist_ok=True)
        years_rage = range(2000, now().year)
        # dissolve Mpas subtables
        data = []
        for year in years_rage:
            file = execute_mapshaper(
                16, self.load_params.input_path.joinpath().as_posix(), year, dissolved_folder
            )
            data.append(
                (
                    gpd.read_file(file)
                    .assign(year=year)
                    .drop(columns=["geometry"])
                    .pipe(global_coverage_calculation)
                    .pipe(separate_parent_iso)
                    .pipe(aggregate_area)
                )
            )
        final = (
            pd.concat(data, ignore_index=True)
            .pipe(region_coverage_calculation)
            .pipe(output, self.transform_params.columns)
        )
        ProtectedAreaExtentSchema(final).to_csv(
            f"{self.load_params.input_path}/{self.load_params.destination_name[0]}.csv",
            index=False,
        )

        return self
