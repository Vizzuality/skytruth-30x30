import traceback
import json
from functools import lru_cache
import os


def watch(func):
    def check(self, *args, **kwargs):
        try:
            self.status.step = func.__name__
            self.set_status("running", f"starting {func.__name__}...")
            func(self, *args, **kwargs)
            self.set_status("finish", f"Success executing {func.__name__}")
        except Exception as e:
            self.set_status("dead", traceback.format_exc())
            raise e
        finally:
            return self

    return check


@lru_cache()
def load_iso_mapping():
    base = os.path.dirname(os.path.abspath(__file__))
    with open(f"{base}/data_commons/iso_map.json") as f:
        iso_map = json.load(f)
    return iso_map


@lru_cache()
def load_regions():
    base = os.path.dirname(os.path.abspath(__file__))
    with open(f"{base}/data_commons/regions_data.json") as f:
        regions = json.load(f)
    return regions
