FROM python:3.7-slim as builder
ENV APP_HOME /application
WORKDIR $APP_HOME
RUN pip install functions-framework
COPY ./requirements.txt ./requirements.txt
RUN pip install --upgrade pip && \
    pip install -r ./requirements.txt

FROM builder as runner
WORKDIR $APP_HOME
COPY main.py ./main.py
COPY ./connect_tcp.py ./connect_tcp.py
RUN pwd && ls -la

ENTRYPOINT ["functions-framework", "--target=index"]