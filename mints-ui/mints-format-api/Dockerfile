FROM node:latest as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . /usr/src/app

EXPOSE 8003

# start app
CMD ["npm", "run", "deploy"]

