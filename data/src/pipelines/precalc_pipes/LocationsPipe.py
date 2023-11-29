from logging import getLogger
from pathlib import Path
from typing import Union
import pandas as pd
import geopandas as gpd
import numpy as np
import json

from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from pipelines.utils import load_iso_mapping, load_regions

from pipelines.output_schemas import LocationSchema

logger = getLogger(__name__)


def add_location_iso(df: pd.DataFrame) -> pd.DataFrame:
    # Create new column "iso" that has the field "ISO_SOV1" for all rows except those in which ISO_SOV2 and ISO_SOV3 are not null. In such cases concatenate ISO_SOV1, ISO_SOV2 and ISO_SOV3
    def reduce_iso(row):
        filtered_isos = filter(lambda iso: isinstance(iso, str), row)

        return ";".join(list(filtered_isos))

    return df.assign(
        iso=lambda row: row[["ISO_SOV1", "ISO_SOV2", "ISO_SOV3"]].apply(reduce_iso, axis=1)
    )


def add_region_iso(df: pd.DataFrame) -> pd.DataFrame:
    regions = load_regions()

    def find_region_iso(iso: str) -> Union[str, None]:
        filtered_regions = list(filter(lambda x: iso in x["country_iso_3s"], regions.get("data")))
        return filtered_regions[0]["region_iso"] if len(filtered_regions) > 0 else None

    return df.assign(region=lambda row: row["iso"].apply(find_region_iso))


def add_location_name(df):
    iso_map = load_iso_mapping()

    def get_name(iso):
        test = iso_map.get(iso, np.nan)
        return test

    return df.assign(name=df.iso.apply(get_name))


def expand_multiple_locations(df: pd.DataFrame) -> pd.DataFrame:
    mask = df["iso"].str.contains(";", na=False)
    split_rows = df[mask].copy()
    split_rows["iso"] = split_rows["iso"].str.split(";")
    split_rows = split_rows.explode("iso")
    return pd.concat([df[~mask], split_rows], ignore_index=True)


def calculate_area(df: pd.DataFrame) -> pd.DataFrame:
    glob = gpd.GeoDataFrame(
        {
            "iso": "GLOB",
            "AREA_KM2": 361000000,
            "location_type": "worldwide",
            "region": np.nan,
            "geometry": gpd.GeoSeries([gpd.GeoSeries(df["geometry"]).unary_union]),
        },
        crs="EPSG:4326",
    )
    mask = df.iso == "ABNJ"
    marine_areas = (
        df[~mask]
        .dissolve(by=["iso", "region"], aggfunc={"AREA_KM2": "sum"})
        .reset_index()
        .assign(location_type="country")
    )
    regions_areas = (
        df[~mask]
        .dissolve(by=["region"], aggfunc={"AREA_KM2": "sum"})
        .reset_index()
        .rename(columns={"region": "iso"})
        .assign(location_type="region")
    )
    highseas = (
        df[mask]
        .dissolve(by=["iso"], aggfunc={"AREA_KM2": "sum"})
        .reset_index()
        .assign(location_type="highseas")
    )
    result = (
        pd.concat(
            [
                glob,
                highseas,
                regions_areas,
                marine_areas,
            ],
            ignore_index=True,
        )
        .dropna(subset=["iso"])
        .reset_index(drop=True)
    )
    result.index = result.index + 1
    result.index.name = "id"

    return result.assign(id=result.index)


def add_groups_and_members(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(
        groups=lambda row: row[["region", "location_type"]].apply(
            lambda x: (np.where(df.iso == x["region"])[0] + 1).tolist()
            if x["location_type"] == "country"
            else [],
            axis=1,
        )
    )


def add_envelope(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(geometry=lambda row: row["geometry"].envelope)


def add_bbox(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(bounds=lambda row: row["geometry"].bounds.apply(list, axis=1))


class LocationsPipe(PreprocessBasePipe):
    pipeline_name = "eez_locations_precalc"
    depends_on = ["eez_intermediate"]
    extract_params = ExtractParams(
        source="",
        output_path="data/eez_intermediate",
    )
    transform_params = TransformParams(
        files="eez_intermediate.shp",
        columns=["code", "name", "totalMarineArea", "type", "groups", "bounds", "id"],
        rename={
            "iso": "code",
            "AREA_KM2": "totalMarineArea",
            "location_type": "type",
        },
    )
    load_params = LoadParams(destination_name=["locations", "region_locations"])

    def __init__(self) -> None:
        super().__init__()
        self.extract_params.source = (
            f"{self.settings.GCS_PATH}/{self.depends_on[0]}/{self.depends_on[0]}.zip",
        )

    def transform(self):
        self.load_params.input_path = Path(f"{self.folder_path}/{self.pipeline_name}")
        # locations data
        locations = (
            gpd.read_file(self.transform_params.input_path)
            .pipe(add_envelope)
            .pipe(add_location_iso)
            .pipe(expand_multiple_locations)
            .pipe(add_region_iso)
            .pipe(calculate_area)
            .pipe(add_bbox)
            .pipe(add_groups_and_members)
            .pipe(add_location_name)
            .rename(columns=self.transform_params.rename)
        )

        locations.drop(
            columns=list(set(locations.columns) - set([*self.transform_params.columns])),
            inplace=True,
        )

        output = {
            "version": 2,
            "data": {
                "api::location.location": LocationSchema(pd.DataFrame(locations)).to_dict(
                    orient="index"
                )
            },
        }
        with open(
            f"{self.load_params.input_path}/{self.load_params.destination_name[0]}.json", "w"
        ) as f:
            json.dump(output, f)

        return self
