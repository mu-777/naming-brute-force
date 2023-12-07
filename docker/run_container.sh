#!/bin/bash

BASE_PATH=$(cd $(dirname $0);cd ..;pwd) 

docker run --rm -itd \
  -v /etc/group:/etc/group:ro \
  -v /etc/passwd:/etc/passwd:ro \
  -v /etc/shadow:/etc/shadow:ro \
  -v $HOME/.vscode-server:$HOME/.vscode-server \
  -u $(id -u $USER):$(id -g $USER) \
  -v ${BASE_PATH}:${BASE_PATH} \
  -w ${BASE_PATH} \
  --name python-scraping_${USER} \
  mu777/python:scraping /bin/sh -c "while : ; do sleep 3; done"
