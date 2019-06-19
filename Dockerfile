FROM node:11.15.0

WORKDIR /usr/src/gdoc-api

COPY package*.json ./

RUN npm install

RUN npm install bcrypt@latest --save

RUN npm audit fix

CMD [ "/bin/bash" ]