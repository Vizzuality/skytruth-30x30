import subprocess
import logging
from typing import Union, Optional, List, Literal
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class InputKwargs:
    combine_files: bool = (False,)
    snap: bool = (False,)
    snap_interval: Union[float, None] = (None,)
    no_topology: bool = (False,)
    encoding: Union[str, None] = (None,)


@dataclass
class OutputKwargs:
    format: str
    target: str
    force: bool = (False,)
    gzip: bool = (False,)
    zip: bool = (False,)


@dataclass
class AffineKwargs:
    shift: Union[float, None] = (None,)
    scale: Union[float, None] = (None,)
    rotate: Union[float, None] = (None,)
    anchor: Union[str, None] = (None,)


@dataclass
class CleanKwargs:
    gap_fill_area: Union[float, None] = (None,)
    sliver_control: Union[float, None] = (None,)
    overlap_rule: Union[str, None] = (None,)
    allow_overlaps: bool = (False,)
    snap_interval: Union[float, None] = (None,)
    rewind: bool = (False,)
    allow_empty: bool = (False,)
    target: Union[str, None] = (None,)


@dataclass
class ClipKwargs:
    source: str
    bbox2: Union[str, None] = (None,)
    remove_slivers: bool = (False,)
    name: Union[str, None] = (None,)
    target: Union[str, None] = (None,)


@dataclass
class DissolveKwargs:
    fields: Union[str, None] = (None,)
    calc: Union[str, None] = (None,)
    sum_fields: Union[str, None] = (None,)
    copy_fields: Union[str, None] = (None,)
    multipart: bool = (False,)
    where: Union[str, None] = (None,)
    name: Union[str, None] = (None,)
    target: Union[str, None] = (None,)


@dataclass
class Dissolve2Kwargs:
    fields: Union[str, None] = (None,)
    calc: Union[str, None] = (None,)
    sum_fields: Union[str, None] = (None,)
    gap_fill_area: Union[float, None] = (None,)
    copy_fields: Union[str, None] = (None,)
    sliver_control: Union[float, None] = (None,)
    allow_overlaps: bool = (False,)
    name: Union[str, None] = (None,)
    target: Union[str, None] = (None,)


@dataclass
class DropKwargs:
    fields: Union[str, None] = (None,)
    target: Union[str, None] = (None,)
    geometry: Union[bool, None] = (None,)
    holes: Union[bool, None] = (None,)


@dataclass
class EachKwargs:
    expression: str
    target: Union[str, None] = (None,)
    where: Union[str, None] = (None,)


@dataclass
class EraseKwargs:
    source: str
    bbox2: Union[str, None] = (None,)
    remove_slivers: bool = (False,)


@dataclass
class ExplodeKwargs:
    target: Union[str, None] = (None,)


@dataclass
class FilterKwargs:
    expression: str
    bbox: Union[str, None] = (None,)
    invert: bool = (False,)
    remove_empty: bool = (False,)
    name: Union[str, None] = (None,)
    target: Union[str, None] = (None,)


@dataclass
class FilterFieldsKwargs:
    fields: Union[str, None] = (None,)
    invert: bool = (False,)
    target: Union[str, None] = (None,)


@dataclass
class JoinKwargs:
    source: str
    keys: Union[str, None] = (None,)
    calc: Union[str, None] = (None,)
    where: Union[str, None] = (None,)
    fields: Union[str, None] = (None,)
    prefix: Union[str, None] = (None,)
    interpolate: Union[str, None] = (None,)
    point_method: Union[bool, None] = (None,)
    largest_overlap: Union[bool, None] = (False,)
    max_distance: Union[float, None] = (None,)
    duplication: Union[bool, None] = (None,)


class Mapshaper:
    input_sources: List[str] = []
    output_sources: str = ""
    commands: list = []

    def input(
        self,
        files: list,
        **kwargs: Optional[InputKwargs],
    ):
        if len(files) == 0:
            raise Exception("No files provided")

        if len(self.commands) > 0:
            logger.warning("Already existing input command will be overwritten")
            self.commands.pop(0)

        self.input_sources = files
        aux_commands = self.__build_subcommand(kwargs, InputKwargs)
        input = f"-i {' '.join(self.input_sources)} {' '.join(aux_commands)}"

        self.commands.insert(0, input)

        return self

    def output(self, outpath: Path, **kwargs: Optional[OutputKwargs]):
        self.output_sources = outpath
        aux_commands = self.__build_subcommand(kwargs, OutputKwargs)
        output = f"-o {self.output_sources} {' '.join(aux_commands)}"

        self.commands.insert(-1, output)

        return self

    def affine(self, **kwargs: Optional[AffineKwargs]):
        if kwargs:
            aux_commands = self.__build_subcommand(kwargs, AffineKwargs)
            self.commands.append(f"-affine {' '.join(aux_commands)}")
        return self

    def classify(self, input):
        logger.warning("Not implemented yet")
        # self.commands.append(f"-classify {input}")
        return self

    def clean(self, **kwargs: Optional[CleanKwargs]):
        aux_commands = self.__build_subcommand(kwargs, CleanKwargs)
        self.commands.append(f"-clean {' '.join(aux_commands)}")
        return self

    def clip(self, **kwargs: Optional[ClipKwargs]):
        aux_commands = self.__build_subcommand(kwargs, ClipKwargs)
        self.commands.append(f"-clip {' '.join(aux_commands)}")
        return self

    def colorizer(self):
        logger.warning("Not implemented yet")
        # self.commands.append(f"-colorizer {input}")
        return self

    def dashlines(self):
        logger.warning("Not implemented yet")
        # self.commands.append(f"-dashlines {input}")
        return self

    def dissolve(self, **kwargs: Optional[DissolveKwargs]):
        aux_commands = self.__build_subcommand(kwargs, DissolveKwargs)
        self.commands.append(f"-dissolve {' '.join(aux_commands)}")
        return self

    def dissolve2(self, **kwargs: Optional[Dissolve2Kwargs]):
        aux_commands = self.__build_subcommand(kwargs, Dissolve2Kwargs)
        self.commands.append(f"-dissolve2 {' '.join(aux_commands)}")
        return self

    def divide(self):
        logger.warning("Not implemented yet")
        # self.commands.append(f"-divide {input}")
        return self

    def dots(self):
        logger.warning("Not implemented yet")
        # self.commands.append(f"-dots {input}")
        return self

    def drop(self, **kwargs: Optional[DropKwargs]):
        aux_commands = self.__build_subcommand(kwargs, DropKwargs)
        self.commands.append(f"-drop {' '.join(aux_commands)}")
        return self

    def each(self, **kwargs: Optional[EachKwargs]):
        aux_commands = self.__build_subcommand(kwargs, EachKwargs)
        self.commands.append(f"-each {' '.join(aux_commands)}")
        return self

    def erase(self, **kwargs: Optional[EraseKwargs]):
        aux_commands = self.__build_subcommand(kwargs, EraseKwargs)
        self.commands.append(f"-erase {' '.join(aux_commands)}")
        return self

    def explode(self, **kwargs: Optional[ExplodeKwargs]):
        aux_commands = self.__build_subcommand(kwargs, ExplodeKwargs)
        self.commands.append(f"-explode {' '.join(aux_commands)}")
        return self

    def filter(self, **kwargs: Optional[FilterKwargs]):
        aux_commands = self.__build_subcommand(kwargs, FilterKwargs)
        self.commands.append(f"-filter {' '.join(aux_commands)}")
        return self

    def filter_fields(self, **kwargs: Optional[FilterFieldsKwargs]):
        aux_commands = self.__build_subcommand(kwargs, FilterFieldsKwargs)
        self.commands.append(f"-filter-fields {' '.join(aux_commands)}")
        return self

    def filter_islands(self, input):
        self.commands.append(f"-filter-islands {input}")
        return self

    def filter_slivers(self, input):
        self.commands.append(f"-filter-slivers {input}")
        return self

    def graticule(self, input):
        self.commands.append(f"-graticule {input}")
        return self

    def grid(self, input):
        self.commands.append(f"-grid {input}")
        return self

    def include(self, input):
        self.commands.append(f"-include {input}")
        return self

    def inlay(self, input):
        self.commands.append(f"-inlay {input}")
        return self

    def innerlines(self, input):
        self.commands.append(f"-innerlines {input}")
        return self

    def join(self, input):
        self.commands.append(f"-join {input}")
        return self

    def lines(self, input):
        self.commands.append(f"-lines {input}")
        return self

    def merge_layers(self, input):
        self.commands.append(f"-merge-layers {input}")
        return self

    def mosaic(self, input):
        self.commands.append(f"-mosaic {input}")
        return self

    def point_grid(self, input):
        self.commands.append(f"-point-grid {input}")
        return self

    def points(self, input):
        self.commands.append(f"-points {input}")
        return self

    def polygons(self, input):
        self.commands.append(f"-polygons {input}")
        return self

    def reproject(self, input):
        self.commands.append(f"-proj {input}")
        return self

    def rectangle(self, input):
        self.commands.append(f"-rectangle {input}")
        return self

    def rectangles(self, input):
        self.commands.append(f"-rectangles {input}")
        return self

    def rename_fields(self, input):
        self.commands.append(f"-rename-fields {input}")
        return self

    def rename_layers(self, input):
        self.commands.append(f"-rename-layers {input}")
        return self

    def require(self, input):
        self.commands.append(f"-require {input}")
        return self

    def run(self, input):
        self.commands.append(f"-run {input}")
        return self

    def shape(self, input):
        self.commands.append(f"-shape {input}")
        return self

    def simplify(self, input):
        self.commands.append(f"-simplify {input}")
        return self

    def snap(self, input):
        self.commands.append(f"-snap {input}")
        return self

    def sort(self, input):
        self.commands.append(f"-sort {input}")
        return self

    def split(self, input):
        self.commands.append(f"-split {input}")
        return self

    def split_on_grid(self, input):
        self.commands.append(f"-split-on-grid {input}")
        return self

    def subdivide(self, input):
        self.commands.append(f"-subdivide {input}")
        return self

    def union(self, input):
        self.commands.append(f"-union {input}")
        return self

    def uniq(self, input):
        self.commands.append(f"-uniq {input}")
        return self

    def control_if(self, input):
        self.commands.append(f"-if {input}")
        return self

    def control_else_if(self, input):
        self.commands.append(f"-elseif {input}")
        return self

    def control_else(self, input):
        self.commands.append(f"-else {input}")
        return self

    def control_end_if(self, input):
        self.commands.append(f"-endif {input}")
        return self

    def control_stop(self, input):
        self.commands.append(f"-stop {input}")
        return self

    def control_target(self, input):
        self.commands.append(f"-target {input}")
        return self

    def calc(self, input):
        self.commands.append(f"-calc {input}")
        return self

    def encodings(self, input):
        self.commands.append(f"-encodings {input}")
        return self

    def info(self, input):
        self.commands.append(f"-info {input}")
        return self

    def inspect(self, input):
        self.commands.append(f"-inspect {input}")
        return self

    def version(self):
        self.commands.append(f"-version")
        return self

    def debug(self):
        print(self.__build_command())

    def execute(self, verbose: bool = False, quiet: bool = False):
        if verbose:
            self = self.__verbose()
        if quiet:
            self = self.__quiet()

        return subprocess.run(self.__build_command(), shell=True)

    def __quiet(self):
        self.commands.append(f"-quiet {input}")
        return self

    def __verbose(self):
        self.commands.append(f"-verbose {input}")
        return self

    def __build_subcommand(self, input: dict, source: dataclass):
        command_list = source.__annotations__.keys()
        aux_commands = []
        for key, value in input.items():
            if key in command_list and type(value) == bool:
                if value:
                    aux_commands.append(f"{key.replace('_', '-')}")
            elif key in command_list:
                aux_commands.append(f"{key.replace('_', '-')}={value}")
        return aux_commands

    def __build_command(self):
        if len(self.commands) == 0:
            raise Exception("No commands provided")

        return f"mapshaper  {' '.join(self.commands)}"
