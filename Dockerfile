FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install node-gyp 
RUN npm install -g nodemon
RUN npm install add bcrypt

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 7000

CMD [ "yarn", "start" ]