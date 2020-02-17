FROM node:8-alpine

EXPOSE 8080

WORKDIR /code
COPY ./package.json /code/
RUN npm install

COPY ./webpack.config.js ./tsconfig.json /code/

CMD npm start
