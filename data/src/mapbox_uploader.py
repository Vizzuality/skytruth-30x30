import requests
import subprocess
import logging
from pathlib import Path
import os
from time import sleep
from tqdm import tqdm

logger = logging.getLogger(__name__)


def uploadToMapbox(source: Path, display_name: str, username: str, token: str):
    """
    Upload the mbtiles file to Mapbox.
    """
    logger.info("Uploading to Mapbox...")

    tileset_name = source.stem
    mapboxCredentials = getS3Credentials(username, token)

    upload_status = uploadToS3(source, mapboxCredentials)
    logger.info(upload_status)
    result = linkToMapbox(
        username, token, mapboxCredentials, tileset_name, display_name
    )
    logger.info(result)

    return result


def getS3Credentials(user: str, token: str) -> dict:
    r = requests.get(
        f"https://api.mapbox.com/uploads/v1/{user}/credentials?access_token={token}"
    )
    r.raise_for_status()
    return r.json()


def setS3Credentials(credentials: dict) -> None:
    os.environ["AWS_ACCESS_KEY_ID"] = credentials["accessKeyId"]
    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials["secretAccessKey"]
    os.environ["AWS_SESSION_TOKEN"] = credentials["sessionToken"]


def uploadToS3(source: Path, credentials: dict) -> int:
    """
    Upload the mbtiles file to S3. https://docs.mapbox.com/help/tutorials/upload-curl/#stage-your-file-on-amazon-s3
    """
    logger.info("Uploading to S3...")
    setS3Credentials(credentials)
    status = subprocess.run(
        f"aws s3 cp {source} s3://{credentials['bucket']}/{credentials['key']} --region us-east-1",
        shell=True,
        check=True,
    )

    if status.returncode != 0:
        raise Exception(f"Upload to S3 failed with status {status.returncode}")

    return status


def linkToMapbox(
    username: str, token: str, credentials: dict, tileset_name: str, display_name=None
):
    def uploadStatus(upload_id):
        url = f"https://api.mapbox.com/uploads/v1/{username}/{upload_id}?access_token={token}"
        s = requests.get(url)

        s.raise_for_status()

        if s.json()["error"]:
            raise Exception(s.json()["error"])

        return s.json()["complete"], s.json()["progress"]

    if not display_name:
        display_name = tileset_name

    # Create the tileset upload
    url = f"https://api.mapbox.com/uploads/v1/{username}?access_token={token}"
    body = {
        "url": f"https://{credentials.get('bucket', '')}.s3.amazonaws.com/{credentials.get('key')}",
        "tileset": f"{username}.{tileset_name}",
        "name": f"{display_name}",
    }
    r = requests.post(url, json=body)
    r.raise_for_status()

    upload_id = r.json()["id"]
    # Progress bar to show upload status in Mapbox
    with tqdm(total=100) as pbar:
        pbar.set_description("Linking tileset to Mapbox")
        pbar.update(0)

        # Check the upload status
        status = False
        while status is False:
            sleep(5)
            status, progress = uploadStatus(upload_id)
            pbar.update(round(progress * 100))

    return status
