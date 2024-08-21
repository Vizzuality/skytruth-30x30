from data.src.helpers.file_handler import FileConventionHandler


def define_paths_intermediate(pipe: str, step: str):
    working_folder = FileConventionHandler(pipe)
    input_path = working_folder.pipe_raw_path
    temp_working_path = working_folder.get_temp_file_path(step)

    output_path = working_folder.get_processed_step_path(step)
    output_file = working_folder.get_step_fmt_file_path(step, "shp")
    zipped_output_file = working_folder.get_step_fmt_file_path(step, "zip", True)
    remote_path = working_folder.get_remote_path(step)
    return input_path, temp_working_path, output_path, output_file, zipped_output_file, remote_path
