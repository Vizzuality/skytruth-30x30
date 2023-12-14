import functions_framework
from flask.logging import default_handler
import logging

from src.connect_tcp import connect_tcp_socket
from src.analysis import get_locations_stats

logger = logging.getLogger(__name__)
logger.addHandler(default_handler)
logger.setLevel(logging.DEBUG)
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
    try:
        geometry = ({**request.args, **request.get_json()}).get("geometry", None)
        if not geometry:
            raise ValueError("geometry is required")

        return get_locations_stats(db, geometry)
    except ValueError as e:
        logger.exception(str(e))
        return {"error": str(e)}, 400
    except Exception as e:
        logger.exception(str(e))
        return {"error": str(e)}, 500
