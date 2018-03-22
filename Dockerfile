FROM node:8

WORKDIR /evolve-migrator
ADD . /evolve-migrator

RUN yarn

ENV DEBUG="evolve-migrator:*"
ENV NODE_PATH="/evolve-migrator/src"

ENV GOOGLE_APPLICATION_CREDENTIALS="/evolve-migrator/google_application_credentials.json"
ENV PG_CONNECTION_STRING="postgresql://postgres:password@localhost:32768/evolve"

CMD ["node", "src/main.js"]