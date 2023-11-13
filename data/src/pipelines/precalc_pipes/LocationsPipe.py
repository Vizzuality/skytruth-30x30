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

logger = getLogger(__name__)


@lru_cache()
def load_iso_mapping():
    with open("data/src/pipelines/data_commons/iso_map.json") as f:
        iso_map = json.load(f)
    return iso_map


@lru_cache()
def load_regions():
    with open("data/src/pipelines/data_commons/regions_data.json") as f:
        regions = json.load(f)
    return regions


def find_region_iso(iso):
    regions = load_regions()

    filtered_regions = list(filter(lambda x: iso in x["country_iso_3s"], regions))

    return filtered_regions[0]["region_iso"] if len(filtered_regions) > 0 else None


def add_location_iso(df):
    # Create new column "iso" that has the field "ISO_SOV1" for all rows except those in which ISO_SOV2 and ISO_SOV3 are not null. In such cases concatenate ISO_SOV1, ISO_SOV2 and ISO_SOV3
    return df.assign(
        iso=lambda row: ";".join(
            filter(None, (row[["ISO_SOV1", "ISO_SOV2", "ISO_SOV3"]]))
        )
    )


def add_region_iso(df):
    return df.assign(region=lambda row: find_region_iso(row["iso"]))


def expand_multiple_locations(df):
    mask = df["iso"].str.contains(";", na=False)
    split_rows = df[mask].copy()
    split_rows["iso"] = split_rows["iso"].str.split(";")
    split_rows = split_rows.explode("iso")
    return pd.concat([df[~mask], split_rows], ignore_index=True)


def calculate_area(df):
    glob = {
        "location_id": "GLOB",
        "total_marine_area": 361000000,
        "location_type": "worldwide",
    }
    marine_areas = (
        df.groupby(["iso"])
        .agg({"AREA_KM2": "sum"})
        .reset_index()
        .assign(location_type="country")
    )
    regions_areas = (
        df.groupby(["region"])
        .agg({"AREA_KM2": "sum"})
        .reset_index()
        .rename(columns={"region": "iso"})
        .assign(location_type="region")
    )

    return pd.concat([marine_areas, regions_areas], ignore_index=True).append(
        glob, ignore_index=True
    )


def add_location_name(df):
    iso_map = load_iso_mapping()
    return df.assign(name_iso=lambda row: iso_map.get(row.iso, None))


class LocationsPipe(PreprocessBasePipe):
    pipeline_name = "eez_locations_precalc"
    depends_on = ["eez_intermediate"]
    extract_params = ExtractParams(
        source="eez/eez_intermediate.zip",
        output_path="data/eez_intermediate",
    )
    transform_params = TransformParams(
        files="eez_v11.shp",
        columns=["location_id", "location_name", "location_type", "total_marine_area"],
    )
    load_params = LoadParams(destination_name=["locations", "region_locations"])

    def transform(self):
        self.load_params.input_path = Path(f"{self.folder_path}/{self.pipeline_name}")
        # locations data
        locations = (
            gpd.read_file(self.transform_params.input_path)
            .pipe(add_location_iso)
            .pipe(expand_multiple_locations)
            .pipe(add_region_iso)
            .pipe(calculate_area)
            .pipe(add_location_name)
        )

        locations.drop(
            columns=list(
                set(locations.columns)
                - set([*self.transform_params.columns, "geometry"])
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
