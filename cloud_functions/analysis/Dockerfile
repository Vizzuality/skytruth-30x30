FROM baseImage as builder
WORKDIR application
COPY ./requirements.txt ./requirements.txt
RUN pip install --upgrade pip && \
    pip install -r ./requirements.txt -t ./lib

FROM builder as runner
COPY main.py ./main.py
COPY ./src ./src

ENTRYPOINT ["functions-framework", "--target my_function"]