import functions_framework
import sqlalchemy

from connect_tcp import connect_tcp_socket

db = connect_tcp_socket()


@functions_framework.http
def index(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    Note:
        For more information on how Flask integrates with Cloud
        Functions, see the `Writing HTTP functions` page.
        <https://cloud.google.com/functions/docs/writing/http#http_frameworks>
    """
    geometry = request.args.get("geometry")

    return get_locations_stats(db, geometry)


def get_locations_stats(db: sqlalchemy.engine.base.Engine, geojson) -> dict:
    with db.connect() as conn:
        stmt = sqlalchemy.text("SELECT COUNT(*) FROM locations WHERE type=:type")
        regions_count = conn.execute(stmt, parameters={"type": "region"}).scalar()
        countries_count = conn.execute(stmt, parameters={"type": "country"}).scalar()

    return {"FRA": 2342341, "USA": 234234, "total_area": 234234}
