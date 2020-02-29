FROM node:8-alpine

WORKDIR /code
COPY ./package.json /code/
RUN npm install

COPY ./webpack.config.js ./tsconfig.json /code/

CMD npm start
