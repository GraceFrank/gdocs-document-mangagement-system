FROM node:10.16.3

WORKDIR /src/app/gdoc-api

COPY package*.json ./

RUN npm install

CMD [ "/bin/bash source.env" ]