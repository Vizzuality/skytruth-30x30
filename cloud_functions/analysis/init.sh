#!/bin/sh
# Upload the data to the database
# Usage: init.sh [OPTION]
for arg in "$@"
do
    case $arg in
        eez)
            echo "uploading eez_minus_mpa"
            URL='vector-data-raw/vizzuality_processed_data/analysis_data/eez_minus_mpa.zip'
            TABLE_NAME='eez_minus_mpa'
            ;;
        gadm)
            echo "uploading gadm_minus_pa"
            URL='vector-data-raw/vizzuality_processed_data/analysis_data/gadm_minus_pa.zip'
            TABLE_NAME='gadm_minus_pa'
            ;;
        --help)
            echo "Usage: init.sh [OPTION]"
            echo "Upload the data to the database"
            echo ""
            echo "Options:"
            echo "  --eez    Upload eez_minus_mpa data"
            echo "  --gadm   Upload gadm_minus_pa data"
            echo "  --help   Display this help message"
            exit 0
            ;;
        *)
            echo "Invalid option $arg"
            exit 1
            ;;
    esac
ogr2ogr --version

ogr2ogr -progress \
          -makevalid -overwrite \
          -nln $TABLE_NAME -nlt PROMOTE_TO_MULTI \
          -lco GEOMETRY_NAME=the_geom \
          -lco PRECISION=FALSE \
          -lco SPATIAL_INDEX=GIST \
          -lco FID=id \
          -t_srs EPSG:4326 \
          -f PostgreSQL PG:"host=$POSTGRES_HOST port=$POSTGRES_PORT \
          user=$POSTGRES_USER password=$POSTGRES_PASSWORD \
          dbname=$POSTGRES_DB active_schema=$POSTGRES_SCHEMA" \
          -doo "PRELUDE_STATEMENTS=CREATE SCHEMA IF NOT EXISTS $POSTGRES_SCHEMA AUTHORIZATION CURRENT_USER;" "/vsizip/vsigs/$URL";

done