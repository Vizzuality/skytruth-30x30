FROM node:18.17-bullseye-slim
# Install dependencies
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
    && apt-get clean
ENV NODE_ENV development

WORKDIR /app/

COPY .yarn ./.yarn
COPY config ./config
COPY database ./database
COPY public ./public
COPY src ./src

COPY .env \
     .nvmrc \
     favicon.png \
     package.json \
     entrypoint.sh \
     tsconfig.json \
     ./

RUN yarn install

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 1337
ENTRYPOINT ["/app/cms/entrypoint.sh"]
