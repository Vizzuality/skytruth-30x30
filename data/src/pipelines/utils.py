import traceback

import asyncio

import multiprocessing
import psutil
from functools import lru_cache
import math


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


def background(f):
    def wrapped(*args, **kwargs):
        return asyncio.get_event_loop().run_in_executor(None, f, *args, **kwargs)

    return wrapped


@lru_cache
def get_system_info(MIN_MEMORY_WORKER=8):
    """Get system info."""
    cpu_count = multiprocessing.cpu_count()
    available_memory = psutil.virtual_memory().available / (1024.0**3)
    recommended_partitions = math.floor(available_memory / MIN_MEMORY_WORKER)
    return {
        "cpu_count": cpu_count,
        "total_memory": psutil.virtual_memory().total / (1024.0**3),
        "available_memory": available_memory,
        "recommended_partitions": (
            recommended_partitions if recommended_partitions < cpu_count else (cpu_count - 1)
        ),
    }
