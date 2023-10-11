from pathlib import Path
import subprocess
import logging
from typing import Union


def simplifyGeometries2Json(source_path: Path) -> Path:
    """simplify geometries and convert to json file using mapshaper

    Args:
        source_path (Path):  The path to the file.

    Returns:
        Path: The path to the output file.
    """

    CMD = f'mapshaper {source_path} -clean allow-overlaps rewind -o format=geojson {source_path.with_suffix(".json")} force'
    subprocess.run(CMD, shell=True, check=True)

    return source_path.with_suffix(".json")


def mbtileGeneration(
    data_path: Path, output_path: Union[Path, None] = None, update: bool = False
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
        assert data_path.exists(), "Data path does not exist."

        if not output_path:
            output_path = data_path.with_suffix(".mbtiles")

        if update or not output_path.exists():
            if data_path.suffix != ".json":
                data_path = simplifyGeometries2Json(data_path)

            assert data_path.suffix == ".json", "Data path must be a json file."

            logging.info("Creating mbtiles file...")

            subprocess.run(
                f"tippecanoe -zg -f -P -o {output_path} --extend-zooms-if-still-dropping {data_path}",
                shell=True,
                check=True,
            )
            data_path.unlink(exist_ok=True)

        return output_path

    except Exception as e:
        logging.error(e)
        return 1
