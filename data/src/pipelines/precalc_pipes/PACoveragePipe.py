from logging import getLogger
from pathlib import Path
import pandas as pd
import geopandas as gpd
import time

from pipelines.processors import (
    calculate_global_coverage,
    separate_parent_iso,
    aggregate_area,
    calculate_region_coverage,
    output_coverage,
)

from pipelines.output_schemas import ProtectedAreaExtentSchema
from pipelines.base_pipe import (
    PreprocessBasePipe,
    ExtractParams,
    TransformParams,
    LoadParams,
)
from helpers.mapshaper import Mapshaper

logger = getLogger(__name__)


class PACoveragePipe(PreprocessBasePipe):
    pipeline_name = "mpa_coverage_precalc"
    depends_on = ["mpa_intermediate"]
    extract_params = ExtractParams(
        source="",
        output_path="data/mpas_intermediate",
    )
    transform_params = TransformParams(
        files="mpas_intermediate.shp",
        columns=["location_id", "location_name", "location_type", "total_marine_area"],
    )
    load_params = LoadParams(destination_name=["locations", "region_locations"])

    def __init__(self) -> None:
        super().__init__()
        self.extract_params.source = (
            f"{self.settings.GCS_PATH}/{self.depends_on[0]}/{self.depends_on[0]}.zip",
        )

    def transform(self):
        self.load_params.input_path = Path(f"{self.folder_path}/{self.pipeline_name}")
        dissolved_folder = self.load_params.input_path.joinpath("timeseries")
        dissolved_folder.mkdir(parents=True, exist_ok=True)
        years_rage = range(2000, time.localtime().tm_year + 1)
        # dissolve Mpas subtables
        data = []
        for year in years_rage:
            file = __execute_mapshaper(
                16, self.load_params.input_path.joinpath().as_posix(), year, dissolved_folder
            )
            data.append(
                (
                    gpd.read_file(file)
                    .assign(year=year)
                    .drop(columns=["geometry"])
                    .pipe(calculate_global_coverage)
                    .pipe(separate_parent_iso)
                    .pipe(aggregate_area)
                )
            )
        final = (
            pd.concat(data, ignore_index=True)
            .pipe(calculate_region_coverage)
            .pipe(output_coverage, self.transform_params.columns)
        )
        ProtectedAreaExtentSchema(final).to_csv(
            f"{self.load_params.input_path}/{self.load_params.destination_name[0]}.csv",
            index=False,
        )

        return self


def __execute_mapshaper(memory, input, year, output_folder):
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
