# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1

RUN mkdir -p /app
WORKDIR /app

COPY api/ /app/api
RUN mkdir /app/web
RUN echo "{ \"name\": \"web\" }" > /app/web/package.json

COPY .env /app
COPY bun.lockb /app
COPY package.json /app

RUN bun install --frozen-lockfile --production

USER bun
EXPOSE 80/tcp
ENTRYPOINT [ "bun", "prod" ]