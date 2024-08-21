import pandas as pd
import shutil

from data.src.helpers.utils import downloadFile, rm_tree
from data.src.pipelines.pipes.utils import define_paths_intermediate


def eez_intermediate(force_clean: bool = True) -> None:
    # Pipe params
    step = "intermediate"
    pipe = "eez"
    # Data sources
    ## EEZ
    EEZ_url = "https://www.marineregions.org/download_file.php"
    EEZ_file_name = "eez_v11.shp"
    EEZ_params = {"name": "World_EEZ_v11_20191118.zip"}
    EEZ_headers = {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "PHPSESSID=29190501b4503e4b33725cd6bd01e2c6; vliz_webc=vliz_webc2; jwplayer.captionLabel=Off",
        "dnt": "1",
        "origin": "https://www.marineregions.org",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
    }

    EEZ_body = {
        "name": "Jason",
        "organisation": "skytruth",
        "email": "hello@skytruth.com",
        "country": "Spain",
        "user_category": "academia",
        "purpose_category": "Conservation",
        "agree": "1",
    }

    ## High seas
    hs_url = "https://www.marineregions.org/download_file.php"
    hs_file_name = "High_seas_v1.shp"
    hs_params = {"name": "World_High_Seas_v1_20200826.zip"}
    hs_headers = {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "PHPSESSID=29190501b4503e4b33725cd6bd01e2c6; vliz_webc=vliz_webc2; jwplayer.captionLabel=Off",
        "dnt": "1",
        "origin": "https://www.marineregions.org",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
    }
    hs_body = {
        "name": "Jason",
        "organisation": "skytruth",
        "email": "hello@skytruth.com",
        "country": "Spain",
        "user_category": "academia",
        "purpose_category": "Conservation",
        "agree": "1",
    }
    input_path, temp_working_path, output_path, output_file, zipped_output_file, remote_path = (
        define_paths_intermediate(pipe, step)
    )

    # Extract data
    ## download files EEZ & High seas
    downloadFile(
        EEZ_url,
        input_path,
        EEZ_body,
        EEZ_params,
        EEZ_headers,
        overwrite=force_clean,
    )
    downloadFile(hs_url, input_path, hs_body, hs_params, hs_headers, overwrite=force_clean)
    ## unzip file if needed & load data
    unziped_folders = []
    for idx, path in enumerate(input_path.glob("*.zip")):
        unziped_folder = temp_working_path.joinpath(path.stem)
        print(unziped_folder)

        if unziped_folder.exists() and force_clean:
            rm_tree(unziped_folder)

        shutil.unpack_archive(path, unziped_folder.parent if idx == 0 else unziped_folder)

        files = [
            gpd.read_file(file)
            for file in unziped_folder.rglob("*.shp")
            if "boundaries" not in file.stem
        ]
        unziped_folders.append(pd.concat(files))

    # Transform data
    ## set the same structure for both datasets updating the high seas one
    unziped_folders[1] = (
        unziped_folders[1]
        .rename(
            columns={"name": "GEONAME", "area_km2": "AREA_KM2", "mrgid": "MRGID"},
        )
        .assign(
            POL_TYPE="High Seas",
            ISO_SOV1="ABNJ",
        )
    )

    # merge datasets
    df = pd.concat(unziped_folders, ignore_index=True)

    df.drop(
        columns=list(
            set(df.columns)
            - set(
                [
                    "MRGID",
                    "GEONAME",
                    "POL_TYPE",
                    "ISO_SOV1",
                    "ISO_SOV2",
                    "ISO_SOV3",
                    "AREA_KM2",
                    "geometry",
                ]
            )
        ),
        inplace=True,
    )

    # save data
    gpd.GeoDataFrame(
        df,
        crs=unziped_folders[0].crs,
    ).to_file(filename=output_file.as_posix(), driver="ESRI Shapefile")

    # zip data
    make_archive(output_path, zipped_output_file)

    # clean unzipped files
    rm_tree(temp_working_path) if temp_working_path.exists() else None
    rm_tree(output_path) if output_path.exists() else None

    # LOAD
    ## load zipped file to GCS
    writeReadGCP(
        credentials=mysettings.GCS_KEYFILE_JSON,
        bucket_name=mysettings.GCS_BUCKET,
        blob_name=remote_path,
        file=zipped_output_file,
        operation="w",
    )
