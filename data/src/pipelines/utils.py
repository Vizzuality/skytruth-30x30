import traceback


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
