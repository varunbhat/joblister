#!/bin/bash

#apt-get update
#apt-get install sudo -y
#curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
#apt-get install nodejs build-essential -y

# phantomjs jobphantomize.js

json_file=$(find ./results -name '*.json')
#echo $json_file

for f in $json_file; do
    echo $f
    nodejs job_db_builder.js $f;
    break;
done

