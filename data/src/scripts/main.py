import click
from pipelines.pipes import get_pipes_names, get_pipe_by_name


@click.group()
def cli():
    pass


@cli.command()
@click.option(
    "--pipe",
    "-p",
    required=True,
    type=click.Choice(get_pipes_names()),
    help="Select a pipe to execute or a list of pipes to execute",
    multiple=True,
)
def run_pipe(pipe):
    pipes = [get_pipe_by_name(p) for p in pipe]
    # sequential execution of pipes, slower but more stable
    with click.progressbar(pipes, label="Executing pipes") as pipe:
        pipe_instance = pipe()
        pipe_instance.execute()

    # TODO: parallel execution of pipes, faster but less stable


if __name__ == "__main__":
    cli()
