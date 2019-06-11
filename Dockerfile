FROM node:8-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN rm -rf node_modules \
  && npm install \
  && cp /usr/src/app/config.example.js /usr/src/app/config.js

CMD [ "npm", "start" ]
