import inspect
from typing import List
from functools import lru_cache
from pipelines.base_pipe import PreprocessBasePipe, VTBasePipe, IntermediateBasePipe
from pipelines import tiles_pipes
from pipelines import precalc_pipes
from pipelines import intermediate_pipes
from pipelines import analysis_pipes


@lru_cache
def get_pipes() -> dict:
    i_p = {
        cls.pipeline_name: cls
        for _, cls in inspect.getmembers(intermediate_pipes, inspect.isclass)
        if issubclass(cls, IntermediateBasePipe) and cls != IntermediateBasePipe
    }

    t_p = {
        cls.pipeline_name: cls
        for _, cls in inspect.getmembers(tiles_pipes, inspect.isclass)
        if issubclass(cls, VTBasePipe) and cls != VTBasePipe
    }

    stat_p = {
        cls.pipeline_name: cls
        for _, cls in inspect.getmembers(precalc_pipes, inspect.isclass)
        if issubclass(cls, PreprocessBasePipe) and cls != PreprocessBasePipe
    }

    analysis_p = {
        cls.pipeline_name: cls
        for _, cls in inspect.getmembers(analysis_pipes, inspect.isclass)
        if issubclass(cls, PreprocessBasePipe) and cls != PreprocessBasePipe
    }

    return {**i_p, **t_p, **stat_p, **analysis_p}


def get_pipes_names():
    return list(get_pipes().keys())


def get_pipe_by_name(name):
    return get_pipes()[name]()


def filter_pipes(pipes: dict, filter: List[str]):
    return {k: v for k, v in pipes.items() if k in filter}


def execution_order(pipes: dict):
    """
    Orders a list of basePipe classes or subclasses based on their dependencies.
    """

    # Create a dictionary to hold the dependencies of each pipe
    dependencies = {pipe.pipeline_name: set(pipe.depends_on) for pipe in pipes.values()}

    # Create a set to hold the pipes that have no dependencies
    no_deps = set(pipes.keys()) - set(dependencies.keys())

    # Create a list to hold the ordered pipes
    ordered_pipes = []

    # Loop until all pipes have been ordered
    while no_deps:
        # Pop a pipe with no dependencies from the set
        pipe_name = no_deps.pop()
        pipe = pipes[pipe_name]

        # Add the pipe to the ordered list
        ordered_pipes.append(pipe)

        # Loop through the dependencies of the pipe
        for dep in dependencies.get(pipe_name, set()):
            # Remove the dependency from the set
            dependencies[pipe_name].remove(dep)

            # If the dependency has no more dependencies, add it to the set
            if not dependencies.get(dep, set()):
                no_deps.add(dep)

    # If there are still dependencies left, raise an error
    if any(dependencies.values()):
        raise ValueError("Circular dependency detected")

    return ordered_pipes
