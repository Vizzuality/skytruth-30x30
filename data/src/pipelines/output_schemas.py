from typing import Union, List
import pandera as pa
from pandera.typing import Index, DataFrame, Series
from pandera.typing.geopandas import GeoDataFrame, GeoSeries
import pandas as pd


class LocationSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    code: Series[str] = pa.Field(coerce=True)
    name: Series[str] = pa.Field(coerce=True)
    totalMarineArea: Series[float] = pa.Field(ge=0, coerce=True)
    type: Series[str] = pa.Field(
        unique_values_eq=["country", "worldwide", "region", "highseas"], coerce=True
    )
    groups: Series[List[int]] = pa.Field(coerce=True)
    bounds: Series[List[float]] = pa.Field(coerce=True)


class ProtectedAreaExtentSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    location: Series[int] = pa.Field(gt=0, coerce=True)
    protection_status: Series[int] = pa.Field(gt=0, coerce=True)
    cumSumProtectedArea: Series[float] = pa.Field(ge=0, coerce=True)
    protectedArea: Series[float] = pa.Field(ge=0, coerce=True)
    protectedAreasCount: Series[int] = pa.Field(ge=0, coerce=True)
    year: Series[int] = pa.Field(ge=2000, coerce=True)


class ProtectionLevelSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    location: Series[int] = pa.Field(gt=0, coerce=True)
    mpaa_protection_level: Series[int] = pa.Field(ge=0, coerce=True)
    year: Series[int] = pa.Field(gt=1900, coerce=True)
    area: Series[float] = pa.Field(ge=0, coerce=True)


class StablishmentStageSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    location: Series[int] = pa.Field(gt=0, coerce=True)
    mpaa_establishment_stage: Series[int] = pa.Field(ge=0, coerce=True)
    protection_status: Series[int] = pa.Field(ge=0, coerce=True)
    area: Series[float] = pa.Field(ge=0, coerce=True)
    year: Series[int] = pa.Field(gt=1900, coerce=True)


class FPLSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    location: Series[int] = pa.Field(gt=0, coerce=True)
    fishing_protection_level: Series[int] = pa.Field(ge=0, coerce=True)
    area: Series[float] = pa.Field(ge=0, coerce=True)


class HabitatsSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    location: Series[int] = pa.Field(gt=0, coerce=True)
    habitat: Series[int] = pa.Field(gt=0, coerce=True)
    protectedArea: Series[float] = pa.Field(ge=0, coerce=True)
    totalArea: Series[float] = pa.Field(ge=0, coerce=True)
    year: Series[int] = pa.Field(gt=1900, coerce=True)


class MPAsSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    wdpaid: Series[str] = pa.Field(coerce=True)
    name: Series[str] = pa.Field(coerce=True)
    year: Series[pd.Int64Dtype] = pa.Field(gt=1800, nullable=True)
    area: Series[float] = pa.Field(ge=0, coerce=True)
    protection_status: Series[int] = pa.Field(ge=0)


class MPAsTableStatsSchema(pa.DataFrameModel):
    id: Index[int] = pa.Field(gt=0, coerce=True)
    mpa: Series[str] = pa.Field(coerce=True)
    location: Series[int] = pa.Field(gt=0, coerce=True)
    area: Series[float] = pa.Field(ge=0, coerce=True)
    mpaa_establishment_stage: Series[int] = pa.Field(ge=0)
    mpaa_protection_level: Series[pd.Int64Dtype] = pa.Field(ge=0, nullable=True, coerce=True)
    fishing_protection_level: Series[pd.Int64Dtype] = pa.Field(ge=0, nullable=True, coerce=True)
