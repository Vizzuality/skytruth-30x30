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

    # For more information about CORS and CORS preflight requests, see:
    # https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request

    # Set CORS headers for the preflight request
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, POST, HEAD",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }

        return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {"Access-Control-Allow-Origin": "*"}

    return (get_locations_stats(db), 200, headers)

def get_locations_stats(db: sqlalchemy.engine.base.Engine) -> dict:
    # just an example of a query
    # with db.connect() as conn:
    #     stmt = sqlalchemy.text(
    #         "SELECT COUNT(*) FROM locations WHERE type=:type"
    #     )
    #     regions_count = conn.execute(stmt, parameters={"type": "region"}).scalar()
    #     countries_count = conn.execute(stmt, parameters={"type": "country"}).scalar()

    # mock response
    return {
        "locations_area": [
            {"code": "FRA", "protected_area": 2385406},
            {"code": "USA", "protected_area": 5000367}
        ],
        "total_area": 73600000,
    }
