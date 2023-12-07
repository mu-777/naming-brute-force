#!/bin/bash

(
  cd $(dirname $0)  
  docker build -t mu777/python:scraping -f ./Dockerfile .
)
