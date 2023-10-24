from pipelines.base_pipe import (
    VTBasePipe,
    DownloadParams,
    TransformParams,
    OutputParams,
)

from utils import downloadFile, unzipFile
from tippcanoe import mbtileGeneration
from mapshaper import Mapshaper
import logging

logger = logging.getLogger(__name__)


class EEZTilesPipe(VTBasePipe):
    pipeline_name = "eez_tiles"
    download_params = DownloadParams(
        url="https://www.marineregions.org/download_file.php",
        output_name="eez_tiles.zip",
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
        files="eez_v11.shp",
        columns=["GEONAME", "POL_TYPE", "ISO_SOV1", "ISO_SOV2", "ISO_SOV3"],
    )
    output_params = OutputParams(destination_name="eez_v11-4pg8or")

    def __init__(self, force_clean: bool = False) -> None:
        super().__init__()
        self.folder_path = self.settings.DATA_DIR.joinpath(self.pipeline_name)
        self.force_clean = force_clean
        self.settings.validate_config()

    def extract(self):
        self.transform_params.input_path = downloadFile(
            self.download_params.url,
            self.folder_path,
            self.download_params.body,
            self.download_params.params,
            overwrite=self.force_clean,
        )
        return self

    def transform(self):
        unziped_folder = unzipFile(self.transform_params.input_path)

        file = unziped_folder.joinpath(self.transform_params.files)
        keep_fields = (
            ",".join(self.transform_params.columns)
            if isinstance(self.transform_params.columns, list)
            else self.transform_params.columns
        )

        Mapshaper(8).input([file.as_posix()]).filter_fields(fields=keep_fields).output(
            file.as_posix(), force=True
        ).execute()

        self.output_params.input_path = mbtileGeneration(file)
        return self


class MPATilesPipe(VTBasePipe):
    pipeline_name = "mpa_tiles"
    download_params = DownloadParams(
        url="https://www.marineregions.org/download_file.php",
        output_name="eez_tiles.zip",
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
    transform_params = TransformParams(files="eez_v11.shp")
    output_params = OutputParams(destination_name="eez_tiles.mbtiles")

    def __init__(self) -> None:
        super().__init__()
        self.folder_path = self.settings.DATA_DIR.joinpath(self.pipeline_name)
        self.settings.validate_config()

    def extract(self):
        self.transform_params.input_path = downloadFile(
            self.download_params.url,
            self.folder_path,
            self.download_params.body,
            self.download_params.params,
        )
        return self

    def transform(self):
        unziped_folder = unzipFile(self.transform_params.input_path)

        logger.info(unziped_folder.joinpath(self.transform_params.files))
        self.output_params.input_path = mbtileGeneration(
            unziped_folder.joinpath(self.transform_params.files)
        )
        return self
