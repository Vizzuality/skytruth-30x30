from logging import getLogger
import shutil
from pathlib import Path
import geopandas as gpd
import pandas as pd
import requests

from pipelines.base_pipe import (
    IntermediateBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from pipelines.utils import watch
from utils import downloadFile, rm_tree


logger = getLogger(__name__)


def calculate_radius(rep_area):
    return (rep_area / 3.14159265358979323846) ** 0.5


def filter_by_methodology(df):
    return df.loc[
        df["STATUS"]
        != "Not Reported" & ~df["DESIG_ENG"].str.contains("MAB", case=False)
    ]


def create_buffer(df):
    df["geometry"] = (
        df.to_crs("ESRI:54009")
        .apply(
            lambda row: row.geometry.buffer(calculate_radius(row["REP_AREA_m"])), axis=1
        )
        .to_crs("EPSG:4326")
    )
    return df


def transform_points(gdf):
    if gdf.geometry.geometry.type == "Point":
        filtered_gdf = gdf.loc[gdf["AREA_KM2"] > 0]
        return filtered_gdf.pipe(create_buffer)
    else:
        return gdf


class EEZIntermediatePipe(IntermediateBasePipe):
    pipeline_name = "mpa_intermediate"
    extract_params = ExtractParams(
        source="https://www.protectedplanet.net/downloads",
        body={
            "domain": "general",
            "format": "shp",
            "token": "marine",
            "id": 21961,
        },
    )
    transform_params = TransformParams(
        columns=[
            "MRGID",
            "GEONAME",
            "POL_TYPE",
            "ISO_SOV1",
            "ISO_SOV2",
            "ISO_SOV3",
            "AREA_KM2",
        ],
        rename={"name": "GEONAME", "area_km2": "AREA_KM2", "mrgid": "MRGID"},
    )
    load_params = LoadParams(destination_name=f"mpa/{pipeline_name}.zip")

    def __init__(self, force_clean: bool = False) -> None:
        super().__init__()
        self.folder_path = self.settings.DATA_DIR.joinpath(self.pipeline_name)
        self.force_clean = force_clean
        self.settings.validate_config()

    @watch
    def extract(self):
        r = requests.get(self.extract_params.source, params=self.extract_params.params)
        r.raise_for_status()

        downloadUrl = r.json().get("url", None)
        file_name = r.json().get("filename", None)

        downloadFile(
            downloadUrl,
            f"{self.folder_path}/{file_name}.zip",
            overwrite=self.force_clean,
        )

        self.transform_params.input_path = self.folder_path
        return self

    @watch
    def transform(self):
        self.load_params.input_path = Path(
            f"{self.folder_path}/{self.pipeline_name}.zip"
        )

        if not self.force_clean and self.load_params.input_path.exists():
            return self

        # unzip file twice due how data is provisioned by protected planet & load data
        shutil.unpack_archive(self.transform_params.input_path, self.folder_path, "zip")

        for file in self.folder_path.glob("*.zip"):
            shutil.unpack_archive(file, self.folder_path, "zip")

        # Transform data using geopandas
        unziped_folders = []
        for file in self.folder_path.glob("*.shp"):
            df = gpd.read_file(file)

            unziped_folders.append(
                df.pipe(filter_by_methodology).pipe(transform_points)
            )

        # merge datasets
        gdf = pd.concat(unziped_folders, ignore_index=True)

        gdf.drop(
            columns=list(
                set(gdf.columns) - set([*self.transform_params.columns, "geometry"])
            ),
            inplace=True,
        )

        # save data
        input_folder = self.load_params.input_path.parent.joinpath(
            self.load_params.input_path.stem
        )

        gpd.GeoDataFrame(
            gdf,
            crs=unziped_folders[0].crs,
        ).to_file(filename=input_folder, driver="ESRI Shapefile")

        shutil.make_archive(input_folder, "zip")

        # clean unzipped files
        rm_tree(input_folder)
        for folder in self.transform_params.input_path:
            rm_tree(self.folder_path.joinpath(folder.stem))

        return self
