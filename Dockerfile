FROM python:3.6-jessie

COPY requirements.txt /tmp/run/

RUN apt-get update 
RUN apt-get install build-essential libffi-dev libxml2-dev python3-dev libssl-dev libxslt1-dev libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev -y

RUN pip install --no-cache-dir -r /tmp/run/requirements.txt
COPY phantomjs-2.1.1-linux-x86_64 /usr/local/
RUN export PATH=$PATH:/usr/local/phantomjs-2.1.1-linux-x86_64/bin  

RUN mkdir /src
WORKDIR /src






