FROM python:3.12-slim as builder
ENV APP_HOME /application
WORKDIR $APP_HOME
RUN pip install functions-framework
COPY ./requirements.txt ./requirements.txt
RUN pip install --upgrade pip && \
    pip install -r ./requirements.txt

FROM builder as runner
WORKDIR $APP_HOME
COPY main.py ./main.py
COPY ./src ./src

ENTRYPOINT ["functions-framework", "--target=index", "--debug", "--port=8080"]