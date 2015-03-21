# Dockerfile to build onpoint

FROM ubuntu:trusty

MAINTAINER Devin Nguyen <devin2712@gmail.com>

RUN apt-get update -y
RUN apt-get -qq update -y

RUN apt-get install -y nodejs-legacy
RUN apt-get install -y npm

VOLUME ["/data"]

ADD . /data

WORKDIR /data

CMD cd /data; npm install; node app.js;