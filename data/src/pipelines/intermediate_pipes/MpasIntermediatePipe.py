from logging import getLogger
import shutil
from pathlib import Path
import geopandas as gpd
import pandas as pd

from pipelines.base_pipe import (
    IntermediateBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from pipelines.utils import watch
from utils import downloadFile, rm_tree


logger = getLogger(__name__)


class EEZIntermediatePipe(IntermediateBasePipe):
    pipeline_name = "mpa_intermediate"
    extract_params = ExtractParams(
        source="https://www.marineregions.org/download_file.php",
        params={"name": "World_EEZ_v11_20191118.zip"},
        headers={
            "content-type": "application/x-www-form-urlencoded",
            "cookie": "PHPSESSID=29190501b4503e4b33725cd6bd01e2c6; vliz_webc=vliz_webc2; jwplayer.captionLabel=Off",
            "dnt": "1",
            "origin": "https://www.marineregions.org",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
        },
        body={
            "name": "Jason",
            "organisation": "skytruth",
            "email": "hello@skytruth.com",
            "country": "Spain",
            "user_category": "academia",
            "purpose_category": "Conservation",
            "agree": "1",
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
        downloadFile(
            self.extract_params.source,
            self.folder_path,
            self.extract_params.body,
            self.extract_params.params,
            self.extract_params.headers,
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

        # unzip file if needed & load data
        unziped_folders = []
        for idx, path in enumerate(self.transform_params.input_path):
            unziped_folder = self.folder_path.joinpath(path.stem)

            if self.force_clean:
                rm_tree(unziped_folder)

            shutil.unpack_archive(
                path, self.folder_path if idx == 0 else unziped_folder
            )

            unziped_folders.append(
                gpd.read_file(unziped_folder.joinpath(self.transform_params.files[idx]))
            )

        # Transform data using geopandas

        # merge datasets
        df = pd.concat(unziped_folders, ignore_index=True)

        df.drop(
            columns=list(
                set(df.columns) - set([*self.transform_params.columns, "geometry"])
            ),
            inplace=True,
        )

        # save data
        input_folder = self.load_params.input_path.parent.joinpath(
            self.load_params.input_path.stem
        )

        gpd.GeoDataFrame(
            df,
            crs=unziped_folders[0].crs,
        ).to_file(filename=input_folder, driver="ESRI Shapefile")

        shutil.make_archive(input_folder, "zip")

        # clean unzipped files
        rm_tree(input_folder)
        for folder in self.transform_params.input_path:
            rm_tree(self.folder_path.joinpath(folder.stem))

        return self
