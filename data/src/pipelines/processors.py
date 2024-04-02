from pathlib import Path
from typing import List, Union, Dict
import pandas as pd
import geopandas as gpd
import numpy as np

from data_commons.loader import load_regions, load_locations_code, load_iso_mapping


def add_location_iso(df: pd.DataFrame) -> pd.DataFrame:
    # Create new column "iso" that has the field "ISO_SOV1" for all rows except those in which ISO_SOV2 and ISO_SOV3 are not null. In such cases concatenate ISO_SOV1, ISO_SOV2 and ISO_SOV3
    def reduce_iso(row):
        filtered_isos = filter(lambda iso: isinstance(iso, str), row)

        return ";".join(list(filtered_isos))

    return df.assign(
        iso=lambda row: row[["ISO_SOV1", "ISO_SOV2", "ISO_SOV3"]].apply(reduce_iso, axis=1)
    )


def add_region_iso(df: pd.DataFrame, iso_column) -> pd.DataFrame:
    regions = load_regions()

    def find_region_iso(iso: str) -> Union[str, None]:
        filtered_regions = list(filter(lambda x: iso in x["country_iso_3s"], regions.get("data")))
        return filtered_regions[0]["region_iso"] if len(filtered_regions) > 0 else None

    return df.assign(region=lambda row: row[iso_column].apply(find_region_iso))


def add_location_name(df):
    iso_map = load_iso_mapping()

    def get_name(iso):
        test = iso_map.get(iso, np.nan)
        return test

    return df.assign(name=df.iso.apply(get_name))


def add_groups_and_members(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(
        groups=lambda row: row[["region", "location_type"]].apply(
            lambda x: (np.where(df.iso == x["region"])[0] + 1).tolist()
            if x["location_type"] == "country"
            else [],
            axis=1,
        )
    )


## Geometry processors


def add_envelope(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(geometry=lambda row: row["geometry"].envelope)


def add_bbox(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(bounds=lambda row: row["geometry"].bounds.apply(list, axis=1))


def calculate_area(df: pd.DataFrame, output_area_column="area_km2") -> pd.DataFrame:
    df[output_area_column] = (df.to_crs("ESRI:54009")["geometry"].area / 10**6).round(2)
    return df


def create_buffer(df: pd.DataFrame) -> pd.DataFrame:
    def calculate_radius(rep_area: float) -> float:
        return ((rep_area * 1000) / 3.14159265358979323846) ** 0.5

    df["geometry"] = df.to_crs("ESRI:54009").apply(
        lambda row: row.geometry.buffer(calculate_radius(row["REP_AREA"])),
        axis=1,
    )
    return df.to_crs("EPSG:4326").copy()


def transform_points(gdf: pd.DataFrame) -> pd.DataFrame:
    if "MultiPoint" in gdf.geometry.geom_type.values:
        filtered_gdf = gdf[gdf["REP_AREA"] > 0].copy()
        return filtered_gdf.pipe(create_buffer)
    else:
        return gdf


def clean_geometries(df: pd.DataFrame) -> pd.DataFrame:
    df["geometry"] = df["geometry"].make_valid()
    return df


## Calculations


def calculate_global_area(
    df: pd.DataFrame,
    gby_col: list,
    agg_ops: Dict[str, str] = {"area_km2": "sum"},
    iso_column="location_i",
) -> pd.DataFrame:
    global_area = df.groupby([*gby_col]).agg(agg_ops).reset_index().assign(**{iso_column: "GLOB"})
    return pd.concat([global_area, df], ignore_index=True)


def calculate_eez_area(df: pd.DataFrame) -> pd.DataFrame:
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


# TODO: check if this is still needed as we also have calculate_global_area
def calculate_global_coverage(df: pd.DataFrame) -> pd.DataFrame:
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


def calculate_stats(df: pd.DataFrame, gby_col: list, iso_column: str) -> pd.DataFrame:
    regions = (
        df.groupby([*gby_col, "region"])
        .agg({"area_km2": "sum"})
        .reset_index()
        .rename(columns={"region": iso_column})
    )

    return pd.concat(
        [
            regions,
            df.groupby([*gby_col, iso_column]).agg({"area_km2": "sum"}).reset_index(),
        ],
        ignore_index=True,
    )


def calculate_region_coverage(df: pd.DataFrame):
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


## TODO: check as this is a component of calculate_stats
def aggregate_area(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby(["PA_DEF", "PARENT_ISO", "year"])
        .agg({"cumSumProt": "sum", "protectedA": "first"})
        .reset_index()
    )


## MISC


def fix_monaco(df: pd.DataFrame, iso_column="location_i", area_column="area_km2") -> pd.DataFrame:
    df.loc[df[iso_column] == "MCO", area_column] = 288
    return df


def set_area(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(area_km2=df[["area_km2_y", "area_km2_x"]].max(axis=1))


def separate_parent_iso(df: pd.DataFrame, iso_column="location_i", separator=";") -> pd.DataFrame:
    df[iso_column] = (
        df[iso_column].str.replace(" ", "").str.replace(":", separator).str.split(separator)
    )
    return df.explode(iso_column)


# TODO: check if this is still needed as we also have separate_parent_iso
def expand_multiple_locations(df: pd.DataFrame) -> pd.DataFrame:
    mask = df["iso"].str.contains(";", na=False)
    split_rows = df[mask].copy()
    split_rows["iso"] = split_rows["iso"].str.split(";")
    split_rows = split_rows.explode("iso")
    return pd.concat([df[~mask], split_rows], ignore_index=True)


def filter_location(df: pd.DataFrame) -> pd.DataFrame:
    return df[~df.location.isna()]


## OUTPUT FUNCTIONS


# TODO: check if this is still needed as we also have output
def output_coverage(df: pd.DataFrame, cols: Dict[str, str]) -> pd.DataFrame:
    locations_code = load_locations_code()
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


def output(
    df: pd.DataFrame, iso_column: str, rep_d: dict, rename: Dict[str, str], drop_cols: List[str]
) -> pd.DataFrame:
    """ """
    if iso_column:
        locations_code = load_locations_code()
        df = df.join(locations_code.set_index("code"), on=iso_column, how="left")
    return (
        df.replace(rep_d)
        .rename(columns=rename)
        .drop(columns=drop_cols)
        .assign(
            id=df.index + 1,
        )
        .set_index("id")
    )


def batch_export(df: pd.DataFrame, batch_size: int, schema: object, folder: Path, filename: str):
    prev = 0
    for idx, size in enumerate(range(batch_size, len(df.index) + batch_size, batch_size)):
        schema(df[(df.index > prev) & (df.index < size)]).to_csv(
            folder.joinpath(f"{filename}_{idx}.csv"),
            index=True,
            encoding="utf-8",
        )
        prev = size
