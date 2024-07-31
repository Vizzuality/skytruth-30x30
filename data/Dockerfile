FROM mambaorg/micromamba:1.5.8 AS base

USER root

RUN apt-get update && \
    apt-get install -y \
    make \
    git \
    python3-rtree \
    software-properties-common \
    graphviz \
    tini \
    ca-certificates \
    build-essential \
    sqlite3 \
    libsqlite3-dev \
    zlib1g-dev \
    manpages-dev \
    curl \
    tzdata \
    unzip \
    xclip \
    libedit-dev \
    g++ && export CXX=g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN sed -i 's/^#force_color_prompt=yes/force_color_prompt=yes/' /etc/skel/.bashrc

USER $MAMBA_USER

FROM base AS build

COPY --chown=$MAMBA_USER:$MAMBA_USER environment.yml /tmp/environment.yml

RUN micromamba install -n base --yes --file /tmp/environment.yml && \
    micromamba clean --all --yes

# TODO: export .env in here

# Otherwise python will not be found
ARG MAMBA_DOCKERFILE_ACTIVATE=1

# Jupyter with Docker Compose
EXPOSE 8888
WORKDIR /home/$MAMBA_USER

FROM build AS dev

USER root

RUN git clone https://github.com/mapbox/tippecanoe.git && \
    cd tippecanoe && \
    make -j && make install && cd ..
RUN npm install -g mapshaper
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install

RUN chown -R $MAMBA_USER:$MAMBA_USER /home/$MAMBA_USER
USER $MAMBA_USER


ENTRYPOINT ["/usr/local/bin/_entrypoint.sh", "jupyter", "lab", "--ip=0.0.0.0","--allow-root", "--no-browser", "--collaborative", "--ServerApp.disable_check_xsrf=True", "--ServerApp.token=''"]
