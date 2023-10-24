import inspect
from functools import lru_cache
from pipelines.base_pipe import BasePipe, VTBasePipe
from pipelines import tiles_pipes
from pipelines import precalc_pipes


@lru_cache
def get_pipes() -> dict:
    t_p = {
        cls.pipeline_name: cls
        for _, cls in inspect.getmembers(tiles_pipes, inspect.isclass)
        if issubclass(cls, VTBasePipe) and cls != VTBasePipe
    }

    stat_p = {
        cls.pipeline_name: cls
        for _, cls in inspect.getmembers(precalc_pipes, inspect.isclass)
        if issubclass(cls, BasePipe) and cls != BasePipe
    }

    return {**t_p, **stat_p}


def get_pipes_names():
    return list(get_pipes().keys())


def get_pipe_by_name(name):
    return get_pipes()[name]()
