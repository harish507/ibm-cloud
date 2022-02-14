FROM node:14.15 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . /usr/src/app

EXPOSE 4000

# start app
CMD ["npm", "run", "deploy"]

