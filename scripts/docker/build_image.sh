#!/bin/bash

IMAGE_NAME=${1:-mu777/python:scraping}

(
  cd $(dirname $0)  
  docker build -t ${IMAGE_NAME} -f ./Dockerfile .
)
