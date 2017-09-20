FROM node:6.11

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN cp /usr/src/app/config.example.js /usr/src/app/config.js


CMD [ "npm", "start" ]