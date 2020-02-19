FROM node:10.19.0-alpine3.9

RUN mkdir -p /app

WORKDIR /app

# Need to copy from the git repo
COPY package.json .
COPY src ./src
COPY sample.env ./.env
COPY healthcheck.js .
COPY Docker/docker-entrypoint.sh .

#Installing the node modules for the app
RUN yarn install --production

RUN chmod +x ./docker-entrypoint.sh

ENV PORT="80"

HEALTHCHECK --interval=30s CMD node healthcheck.js

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["yarn", "start"]