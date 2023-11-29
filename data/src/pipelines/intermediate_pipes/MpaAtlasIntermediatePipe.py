from logging import getLogger
import shutil
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
from pipelines.utils import watch
from utils import downloadFile, rm_tree, make_archive


logger = getLogger(__name__)


def set_wdpa_id(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(
        wdpa_id=df["wdpa_pid"]
        .fillna(df["wdpa_id"])
        .replace(to_replace=[None, "None"], value=np.nan)
    )


def protection_level(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(
        protection_level=np.where(
            df["protection_mpaguide_level"].isin(["full", "high"]),
            "fully or highly protected",
            "less protected or unknown",
        ),
        expand=False,
    )


def status(df: pd.DataFrame) -> pd.DataFrame:
    return df.replace(
        {"establishment_stage": "proposed/committed"},
        {"establishment_stage": "proposed or committed"},
        regex=True,
    )


def create_year(df: pd.DataFrame) -> pd.DataFrame:
    df["proposed_date"] = df["proposed_date"].str[:4].astype("Int64")
    df["designated_date"] = df["designated_date"].str[:4].astype("Int64")
    df["implemented_date"] = df["implemented_date"].str[:4].astype("Int64")
    return df.assign(
        year=df[["proposed_date", "designated_date", "implemented_date"]]
        .max(axis=1)
        .fillna(0)
        .astype(int)
        .replace(0, pd.NaT)
    )


class MpaAtlasIntermediatePipe(IntermediateBasePipe):
    pipeline_name = "mpaatlas_intermediate"
    extract_params = ExtractParams(
        source="https://guide.mpatlas.org/api/v1/zone/geojson",
    )
    transform_params = TransformParams(
        files="mpatlas_assess_zone.geojson",
        columns=[
            "wdpa_id",
            "name",
            "designation",
            "sovereign",
            "establishment_stage",
            "protection_mpaguide_level",
            "protection_level",
            "year",
        ],
        rename={"sovereign": "location_id", "wdpa_pid": "wdpa_id"},
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
        self.transform_params.input_path = downloadFile(
            self.extract_params.source,
            self.folder_path,
            self.extract_params.body,
            self.extract_params.params,
            self.extract_params.headers,
            overwrite=self.force_clean,
            file=self.transform_params.files,
        )
        return self

    @watch
    def transform(self):
        self.load_params.input_path = Path(f"{self.folder_path}/{self.pipeline_name}.zip")

        if not self.force_clean and self.load_params.input_path.exists():
            return self
        # load data
        gdf = gpd.read_file(self.transform_params.input_path)

        # transform data
        df = gdf.pipe(set_wdpa_id).pipe(protection_level).pipe(status).pipe(create_year)

        df.drop(
            columns=list(set(df.columns) - set([*self.transform_params.columns, "geometry"])),
            inplace=True,
        )
        df.rename(columns=self.transform_params.rename, inplace=True)
        # save data
        input_folder = self.load_params.input_path.parent.joinpath(self.load_params.input_path.stem)

        gpd.GeoDataFrame(
            df,
            crs=gdf.crs,
        ).to_file(filename=input_folder.as_posix(), driver="ESRI Shapefile", encoding="utf-8")

        make_archive(input_folder, self.load_params.input_path)

        # clean unzipped files
        rm_tree(input_folder)

        return self
