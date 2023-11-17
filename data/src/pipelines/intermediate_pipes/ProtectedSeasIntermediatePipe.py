from logging import getLogger
from shutil import unpack_archive
from pathlib import Path
import geopandas as gpd
import pandas as pd
import numpy as np

from pipelines.base_pipe import (
    IntermediateBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from pipelines.utils import watch, load_country_mapping
from utils import rm_tree, writeReadGCP, make_archive


logger = getLogger(__name__)


def get_mpas(df: pd.DataFrame) -> pd.DataFrame:
    mask1 = df["wdpa_id"].notna()
    mask2 = df["wdpa_id"] != "0"
    return df[mask1][mask2].reset_index()


def add_location_iso(df: pd.DataFrame) -> pd.DataFrame:
    country_map = load_country_mapping()

    def get_parent_iso(country):
        try:
            if country:
                return country_map.get(country, np.nan)
            else:
                return "FRA"
        except ValueError:
            return np.nan

    return df.assign(iso=df.country.apply(get_parent_iso))


def set_fps_classes(df: pd.DataFrame) -> pd.DataFrame:
    fps_classes = {1: "less", 2: "less", 3: "moderately", 4: "highly", 5: "highly"}
    return df.assign(
        FPS_cat=df["removal_of_marine_life_is_prohibited"].map(fps_classes),
        expand=False,
    )


class ProtectedSeasIntermediatePipe(IntermediateBasePipe):
    pipeline_name = "protectedseas_intermediate"
    extract_params = [
        ExtractParams(
            source="ProtectedSeas/ProtectedSeas_06142023.csv",
        ),
        ExtractParams(
            source="ProtectedSeas/ProtectedSeas_ProtectedSeas_06142023_shp_ProtectedSeas_06142023_shp.zip",
        ),
    ]
    transform_params = TransformParams(
        files=[
            "ProtectedSeas_06142023.csv",
            "ProtectedSeas_ProtectedSeas_06142023_shp_ProtectedSeas_06142023_shp.shp",
        ],
        columns=[
            "site_id",
            "iso",
            "FPS_cat",
            "site_name",
            "country",
            "wdpa_id",
            "removal_of_marine_life_is_prohibited",
            "total_area",
        ],
        rename={"removal_of_marine_life_is_prohibited": "FPS"},
    )
    load_params = LoadParams()

    def __init__(self, force_clean: bool = False) -> None:
        super().__init__()
        self.folder_path = self.settings.DATA_DIR.joinpath(self.pipeline_name)
        self.force_clean = force_clean
        self.settings.validate_config()
        self.load_params.input_path = self.folder_path.joinpath(f"{self.pipeline_name}.zip")
        self.load_params.destination_name = (
            f"{self.settings.GCS_PATH}/{self.pipeline_name}/{self.load_params.input_path.stem}.zip"
        )

    @watch
    def extract(self):
        self.transform_params.input_path = []
        if self.force_clean:
            rm_tree(self.folder_path)

        self.folder_path.mkdir(parents=True, exist_ok=True)
        for file in self.extract_params:
            output = self.folder_path.joinpath(file.source.split("/")[-1])
            if not output.exists():
                writeReadGCP(
                    credentials=self.settings.GCS_KEYFILE_JSON,
                    bucket_name=self.settings.GCS_BUCKET,
                    blob_name=file.source,
                    file=output,
                    operation="r",
                )
            self.transform_params.input_path.append(output)

        return self

    @watch
    def transform(self):
        if self.load_params.input_path.exists() and not self.force_clean:
            return self
        # unzip shapefile
        unpack_archive(self.transform_params.input_path[1], self.folder_path, "zip")

        # transform data
        data_table = (
            pd.read_csv(self.transform_params.input_path[0])
            .pipe(get_mpas)
            .pipe(add_location_iso)
            .pipe(set_fps_classes)
        )
        data_table.drop(
            columns=data_table.columns.difference(self.transform_params.columns), inplace=True
        )
        data_table.rename(columns=self.transform_params.rename, inplace=True)
        # load geoemtries merge & save data
        input_folder = self.folder_path.joinpath(self.pipeline_name)
        gdf = gpd.read_file(
            self.transform_params.input_path[1].parent.joinpath(self.transform_params.files[1])
        )
        gdf.merge(data_table, how="inner", left_on="SITE_ID", right_on="site_id").drop(
            columns=["SITE_ID", "SITE_NAME"]
        ).to_file(filename=input_folder.as_posix(), driver="ESRI Shapefile", encoding="utf-8")

        # zip data
        make_archive(input_folder, self.load_params.input_path)

        # clean unzipped files
        rm_tree(input_folder)

        return self
