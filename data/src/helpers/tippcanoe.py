from dataclasses import dataclass
from pathlib import Path
import subprocess
import logging
from typing import Union

from helpers.mapshaper import Mapshaper


@dataclass
class ExcessParams:
    input_path: Path
    output_path: Path
    update: bool = False


def simplifyGeometries2Json(
    source_path: Path, output_path: Union[Path, None] = None, **kwargs: ExcessParams
) -> Path:
    if not output_path:
        output_path = source_path.with_suffix(".json")

    Mapshaper().input([source_path.as_posix()]).clean(allow_overlaps=True, rewind=True).output(
        output_path.as_posix(), format="geojson"
    ).execute()

    return output_path


def json2mbtiles(
    source_path: Path, output_path: Union[Path, None] = None, **kwargs: ExcessParams
) -> Path:
    if not output_path:
        output_path = source_path.with_suffix(".json")
    # TODO: create a similar class that the one used with mapshaper in order to allow extra params
    subprocess.run(
        f"tippecanoe -zg -f -P -o {output_path} --extend-zooms-if-still-dropping {source_path}",
        shell=True,
        check=True,
    )
    source_path.unlink()
    return output_path


def mbtileGeneration(
    data_path: Path,
    output_path: Union[Path, None] = None,
    update: bool = False,
    **kwargs: ExcessParams,
) -> Path:
    """
    generate mbtiles file from geomtry file

    Args:
        data_path (Path): The path to the file.
        output_path (Union[Path, None], optional): The path to the output file. The default is None.
        update (bool, optional): Whether to update the mbtiles file. The default is False.

    Returns:
        Path: The path to the output file.

    """
    try:
        if not data_path.exists():
            raise FileNotFoundError("Data path does not exist.")

        if not output_path:
            output_path = data_path.with_suffix(".mbtiles")

        if update or not output_path.exists():
            if data_path.suffix != ".json":
                data_path = simplifyGeometries2Json(data_path, **kwargs)
            if data_path.suffix != ".json":
                raise Exception("Data path must be a json file.")

            logging.info("Creating mbtiles file...")
            json2mbtiles(data_path, output_path, **kwargs)

        return output_path

    except Exception as e:
        raise e
