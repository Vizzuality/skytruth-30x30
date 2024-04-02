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
from pipelines.processors import (
    add_envelope,
    add_location_iso,
    expand_multiple_locations,
    add_region_iso,
    calculate_eez_area,
    add_bbox,
    add_groups_and_members,
    add_location_name,
)

from pipelines.output_schemas import LocationSchema

logger = getLogger(__name__)


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
            .pipe(calculate_eez_area)
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
