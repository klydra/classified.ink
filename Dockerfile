# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1

RUN mkdir /app
WORKDIR /app

COPY api/ /app/api
RUN mkdir /app/web
COPY web/package.json /app/web

COPY .env /app
COPY bun.lockb /app
COPY package.json /app

RUN bun install --frozen-lockfile --production

USER bun
ENTRYPOINT [ "bun", "prod" ]