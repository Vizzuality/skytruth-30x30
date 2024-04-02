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
from pipelines.processors import transform_points, clean_geometries
from pipelines.utils import watch
from helpers.utils import downloadFile, rm_tree, make_archive


logger = getLogger(__name__)


class MpasIntermediatePipe(IntermediateBasePipe):
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
            "geometry",
            "WDPAID",
            "WDPA_PID",
            "PA_DEF",
            "NAME",
            "PARENT_ISO",
            "STATUS",
            "STATUS_YR",
            "GIS_M_AREA",
            "AREA_KM2",
        ],
        rename={},
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
        r = requests.post(self.extract_params.source, data=self.extract_params.body)
        r.raise_for_status()

        downloadUrl = r.json().get("url")
        self.transform_params.files = f'{r.json().get("title")}.zip'
        self.transform_params.input_path = Path(f"{self.folder_path}/{self.transform_params.files}")

        downloadFile(
            url=downloadUrl,
            output_path=self.folder_path,
            overwrite=self.force_clean,
            file=self.transform_params.files,
        )

        return self

    @watch
    def transform(self):
        self.load_params.input_path = Path(f"{self.folder_path}/{self.pipeline_name}.zip")
        input_folder = self.load_params.input_path.parent.joinpath(self.load_params.input_path.stem)

        if not self.force_clean and self.load_params.input_path.exists():
            return self

        # unzip file twice due how data is provisioned by protected planet
        temp_folder = self.folder_path.joinpath("temp")
        temp_folder.mkdir(parents=True, exist_ok=True)

        unzip_folder = temp_folder.joinpath(self.transform_params.input_path.stem)
        shutil.unpack_archive(
            self.transform_params.input_path,
            unzip_folder,
            "zip",
        )

        for file in unzip_folder.glob("*.zip"):
            shutil.unpack_archive(file, temp_folder.joinpath(file.stem), "zip")

        # load data & Transform it
        unziped_folders = []
        for file in temp_folder.glob("*/*.shp"):
            df = (
                gpd.read_file(file)
                .pipe(filter_by_methodology)
                .pipe(transform_points)
                .pipe(clean_geometries)
            )
            unziped_folders.append(df)

        # merge datasets
        gdf = gpd.GeoDataFrame(
            pd.concat(unziped_folders, ignore_index=True),
            crs=unziped_folders[0].crs,
        )

        gdf.drop(
            columns=list(set(gdf.columns) - set([*self.transform_params.columns, "geometry"])),
            inplace=True,
        )
        gdf["WDPAID"] = pd.to_numeric(gdf["WDPAID"], downcast="integer")
        # save data

        gdf.to_file(filename=input_folder, driver="ESRI Shapefile", encoding="utf-8")

        make_archive(input_folder, self.load_params.input_path)

        # clean unzipped files
        rm_tree(input_folder)
        rm_tree(temp_folder)

        return self


def filter_by_methodology(df: pd.DataFrame) -> pd.DataFrame:
    mask = (df["STATUS"] != "Not Reported") & ~(df["DESIG_ENG"].str.contains("MAB", case=False))
    return df[mask].reset_index(drop=True)
