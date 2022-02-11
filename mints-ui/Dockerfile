FROM node:latest as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN cd /usr/src/app

COPY ./package.json ./package.json
COPY ./mints-web-portal /usr/src/app/mints-web-portal
COPY ./mints-ui /usr/src/app/mints-ui

EXPOSE 3000 7000

CMD ["npm", "run", "deploy"]

