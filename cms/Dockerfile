FROM node:18.17-bullseye-slim

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y \
      build-essential \
      gcc autoconf \
      automake \
      libc6 \
      zlib1g-dev \
      libpng-dev \
      nasm bash \
      libvips-dev \
      git \
    && apt-get clean

ENV NODE_ENV development
RUN mkdir /app && chown node:node /app

USER node

WORKDIR /app

COPY . ./

RUN yarn install --immutable

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 1337

ENTRYPOINT ["/app/entrypoint.sh"]
