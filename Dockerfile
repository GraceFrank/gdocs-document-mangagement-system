FROM node:11.15.0

WORKDIR /usr/src/gdoc-api

COPY package*.json ./

RUN npm install

CMD [ "/bin/bash" ]