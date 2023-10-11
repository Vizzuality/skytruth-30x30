import requests
import subprocess
import logging
from pathlib import Path
import os


def uploadToMapbox(source: Path, display_name: str, username: str, token: str):
    """
    Upload the mbtiles file to Mapbox.
    """
    logging.info("Uploading to Mapbox...")

    tileset_name = source.stem
    mapboxCredentials = getS3Credentials(username, token)
    uploadToS3(source, mapboxCredentials)
    result = linkToMapbox(source, mapboxCredentials, tileset_name, display_name)

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
    try:
        logging.info("Uploading to S3...")
        setS3Credentials(credentials)
        status = subprocess.run(
            f"aws s3 cp {source} s3://{credentials['bucket']}/{credentials['key']} --region us-east-1",
            shell=True,
            check=True,
        )
        return status
    except Exception as e:
        logging.error(e)
        return 1


def linkToMapbox(username, token, credentials, tileset_name, display_name):
    url = f"https://api.mapbox.com/uploads/v1/{username}?access_token={token}"
    body = {
        "url": f"http://{credentials['bucket']}.s3.amazonaws.com/{credentials['key']}",
        "tileset": f"{username}.{tileset_name}",
        "name": f"{display_name}",
        "private": False,
    }
    r = requests.post(url, json=body)
    r.raise_for_status()
    return r.json()
