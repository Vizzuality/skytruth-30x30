import json
from typing import Union
from requests import Session
from getpass import getpass
from pathlib import Path
from functools import cached_property
import logging

logger = logging.getLogger(__name__)


class Strapi:
    """Strapi class to interact with Strapi API, more info at https://strapi.io/documentation/developer-docs/latest/developer-resources/content-api.html#endpoints
    and <your strapi instance>/cms/documentation"""

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
                raise ValueError(r.json().get("error"))

        self.session.headers.update({"Authorization": f"Bearer {jwt}"})

        return self

    def logout(self) -> None:
        self.session.close()

    @cached_property
    def getCollections(self):
        response = self.session.get(f"{self.url}/content-manager/content-types")
        response.raise_for_status()
        data = list(
            filter(
                lambda x: x.get("isDisplayed") == True and "api::" in x.get("uid"),
                response.json().get("data"),
            )
        )
        return data

    def getCollectionMetadata(self, name):
        return list(
            filter(
                lambda x: (name in x.get("info", {}).values()),
                self.getCollections,
            )
        )

    def getCollectionData(self, collectionUid: str):
        response = self.session.get(f"{self.url}/api/{collectionUid}")
        response.raise_for_status()
        return response.json()

    def importCollectionData(self, collectionApiID: str, file_path: Path, idField: str = "id"):
        extension = file_path.suffix

        with open(file_path, "rb") as f:
            data = f.read()

        response = self.session.post(
            f"{self.url}/api/import-export-entries/content/import",
            json={
                "idField": idField,
                "slug": f"api::{collectionApiID}.{collectionApiID}",
                "data": data,
                "format": extension,
            },
        )
        response.raise_for_status()
        return self

    def exportCollectionData(self, collectionApiID: str, file_path: Path, idField: str = "id"):
        response = self.session.get(
            f"{self.url}/api/import-export-entries/content/export?slug=api::{collectionApiID}.{collectionApiID}&idField={idField}"
        )
        response.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(response.content)
        return self

    def deleteCollectionData(self, collectionApiID: str, ids: list | None = None):

        if ids is None:
            ids = self._getCollectionIds(collectionApiID)

        response = self.session.post(
            f"{self.url}/content-manager/collection-types/api::{collectionApiID}.{collectionApiID}/actions/bulkDelete",
            json={"ids": ids},
        )
        response.raise_for_status()
        return self

    def _getCollectionIds(self, collectionApiID: str):
        response = self.session.get(
            f"{self.url}/api/{collectionApiID}",
            params={"fields[0]": "id", "sort[0]": "id:desc"},
        )
        response.raise_for_status()

        return range(1, response.json().get("data", [{}])[0].get("id") + 1)
