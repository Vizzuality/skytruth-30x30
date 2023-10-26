from typing import Union
from requests import Session
from getpass import getpass
from pathlib import Path
from functools import cached_property
import logging

logger = logging.getLogger(__name__)


class Strapi:
    session: Union[str, None] = None
    url: Union[str, None] = None

    def __init__(self, url):
        self.url = url
        self.session = Session()

    def login(
        self,
        username: Union[str, None] = None,
        password: Union[str, None] = None,
        jwt: Union[str, None] = None,
    ):
        """Login to Strapi and set the JWT token in the session headers
        Remember that strapi has 3 types of JWT tokens:
        - API tokens: for public access
        - Authenticated user tokens: for authenticated users
        - Admin tokens: for admin users

        only authenticated user tokens are valid for the content manager get Collections.
        """
        if not jwt:
            if not username:
                username = getpass("Enter your username: ")
            if not password:
                password = getpass("Enter your password: ")

            try:
                r = self.session.post(
                    f"{self.url}/api/auth/local",
                    json={"identifier": username, "password": password},
                    headers={"accept": "application/json"},
                )
                r.raise_for_status()
                jwt = r.json().get("jwt")
            except Exception as e:
                logger.error(r.json())
                raise ValueError(r.json().get("error"))

        self.session.headers.update({"Authorization": f"Bearer {jwt}"})

        return self

    def logout(self) -> None:
        self.session.close()

    @cached_property
    def getCollections(self):
        response = self.session.get(f"{self.url}/content-manager/collection-types")
        response.raise_for_status()
        data = [
            response.json().get("data")
            for collection in response.json()
            if collection.get("isDisplayed") == True
        ]
        return data

    def getCollectionMetadata(self, collectionName):
        return list(filter(lambda x: (collectionName in x), self.getCollections))

    def getCollectionData(self, collectionName):
        response = self.session.get(f"{self.url}/api/{collectionName}")
        response.raise_for_status()
        return response.json()

    def importCollection(self, collectionName: str, file_path: Path, idField: str):
        extension = file_path.suffix

        with open(file_path, "rb") as f:
            data = f.read()

        response = self.session.post(
            f"{self.url}/api/import-export-entries/content/import",
            json={
                "idField": idField,
                "slug": f"api::{collectionName}.{collectionName}",
                "data": data,
                "format": extension,
            },
        )
        response.raise_for_status()
        return self
