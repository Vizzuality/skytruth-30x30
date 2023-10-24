import zipfile
import os
import requests
from logging import getLogger
from pathlib import Path
from typing import Union

logger = getLogger(__name__)


def rm_tree(pth: Path) -> None:
    pth = Path(pth)
    for child in pth.glob("*"):
        if child.is_file():
            child.unlink()
        else:
            rm_tree(child)
    pth.rmdir()


def downloadFile(
    url: str,
    output_path: Union[Path, None] = None,
    body: Union[dict, None] = None,
    params: Union[dict, None] = None,
    headers: Union[dict, None] = None,
    overwrite: bool = False,
    file: Union[str, None] = None,
) -> Path:
    """
    Download a file from a url.

    Args:
        url (str): The url to the file.
        output_path (Union[Path, None], optional): The path to the output file.
                                The default is None.
    Returns:
        Path: The path to the output file.
    """
    try:
        if not output_path:
            output_path = Path(os.getcwd())

        if not file and "name=" not in url and "name" not in params.keys():
            raise ValueError("No file name in url or params")
        if not file:
            file = url.split("=")[-1] if "name=" in url else params["name"]
        output_file = output_path.joinpath(file)

        if (
            output_file.parent.exists() and overwrite
        ):  # so we can always start from scratch
            rm_tree(output_file.parent)

        output_file.parent.mkdir(parents=True, exist_ok=True)

        if output_file.exists() and not overwrite:
            logger.info(f"File {output_file} already exists.")
            return output_file
        if body:
            r = requests.post(
                url, params=params, data=body, headers=headers, allow_redirects=True
            )
        else:
            r = requests.get(url, params, headers=headers, allow_redirects=True)

        r.raise_for_status()

        with open(output_file, "wb") as f:
            f.write(r.content)

        logger.info("Download Finish.")
        return output_file

    except Exception as e:
        logger.error(e)
        raise e


def unzipFile(source_path: Path, output_path: Union[Path, None] = None) -> Path:
    """unzip a file

    Args:
        source_path (Path): The path to the file.
        output_path (Union[Path, None], optional): The path to the output file. The default is None.

    Returns:
        Path: The path to the output file.
    """
    if not output_path:
        output_path = source_path.parent

    with zipfile.ZipFile(source_path, "r") as zip_ref:
        zip_ref.extractall(output_path)

    logger.info("Unzip Finish.")

    return output_path.joinpath(source_path.stem)
