FROM ubuntu:17.04

COPY phantomjs /usr/bin/phantomjs

RUN apt-get update
RUN apt-get install libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev -y

RUN mkdir /src
WORKDIR /src






