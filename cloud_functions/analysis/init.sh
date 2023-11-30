ogr2ogr -makevalid -update -append \
  -nln wdpa -nlt PROMOTE_TO_MULTI \
  -geomfield the_geom \
  -t_srs EPSG:4326 -a_srs EPSG:4326 \
  -f PostgreSQL PG:"dbname=$GEO_POSTGRES_DB host=$GEO_POSTGRES_HOST \
  port=$GEO_POSTGRES_PORT user=$GEO_POSTGRES_USER password=$GEO_POSTGRES_PASSWORD schemas=myshapefiles" "/vsizip//vsicurl/https://raw.githubusercontent.com/OSGeo/gdal/master/autotest/ogr/data/shp/poly.zip";