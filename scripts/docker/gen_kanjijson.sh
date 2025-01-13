#!/bin/bash

SCRIPTS_PATH=$(cd $(dirname $0);cd ..;pwd) 
REPO_PATH=$(cd ${SCRIPTS_PATH};cd ..;pwd) 
IMAGE_NAME=mu777/python:scraping

COMMAND=$@

if [ -z "$COMMAND" ]; then
  COMMAND="python scraping_kanji.py --outdir ${REPO_PATH}/public"
fi

# イメージが存在するか確認
if ! docker image inspect ${IMAGE_NAME} >/dev/null 2>&1; then
  echo "イメージが見つかりません。ビルドを開始します..."
  $(dirname $0)/build_image.sh ${IMAGE_NAME}
fi


docker run --rm -a stdout -a stderr\
  -v /etc/group:/etc/group:ro \
  -v /etc/passwd:/etc/passwd:ro \
  -v /etc/shadow:/etc/shadow:ro \
  -u $(id -u $USER):$(id -g $USER) \
  -v ${REPO_PATH}:${REPO_PATH} \
  -w ${SCRIPTS_PATH} \
  --name scraping_kanji \
  ${IMAGE_NAME} ${COMMAND}