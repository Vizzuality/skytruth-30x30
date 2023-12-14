#!/bin/sh


URL='vector-data-raw/vizzuality_processed_data/analysis_data/eez_minus_mpa.zip'

ogr2ogr -progress \
  -makevalid -overwrite \
  -nln eez_minus_mpa -nlt PROMOTE_TO_MULTI \
  -lco GEOMETRY_NAME=the_geom \
  -lco PRECISION=FALSE \
  -lco SPATIAL_INDEX=GIST \
  -lco FID=id \
  -t_srs EPSG:4326 -a_srs EPSG:4326 \
  -f PostgreSQL PG:"host=$POSTGRES_HOST port=$POSTGRES_PORT \
   user=$POSTGRES_USER password=$POSTGRES_PASSWORD \
   dbname=$POSTGRES_DB active_schema=$POSTGRES_SCHEMA" \
   -doo "PRELUDE_STATEMENTS=CREATE SCHEMA IF NOT EXISTS $POSTGRES_SCHEMA AUTHORIZATION CURRENT_USER;" "/vsizip/vsigs/$URL";