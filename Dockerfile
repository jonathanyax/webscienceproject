# Dockerfile to build onpoint

FROM ubuntu:trusty

MAINTAINER Devin Nguyen <devin2712@gmail.com>

RUN apt-get update -y
RUN apt-get -qq update -y

# Install Node things
RUN apt-get install -y nodejs-legacy
RUN apt-get install -y npm

# Install MongoDB.
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y mongodb-org && \
  rm -rf /var/lib/apt/lists/*

# Create the MongoDB data directory
RUN mkdir -p /data/db

VOLUME ["/data"]
VOLUME ["/data/db"]

ADD . /data

WORKDIR /data

# Expose port 27017 from the container to the host
EXPOSE 27017
EXPOSE 28017

CMD ["mongod"]

CMD cd /data; npm cache clean; npm install; npm start;