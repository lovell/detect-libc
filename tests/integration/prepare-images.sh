#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

docker-build () {
  echo "-> Building nodejs-custom:$1..."
  docker build --quiet -t "nodejs-custom:$1" -f "nodejs-$1.dockerfile" .
}

docker-pull () {
  echo "-> Pulling $1..."
  docker pull "$1"
}

docker-build 0.10.48-alpine
docker-build 0.12.18-alpine
docker-pull node:4.8.5-alpine
docker-pull node:6.11.5-alpine
docker-pull node:8.8.1-alpine

docker-build 0.10.48-debian
docker-build 0.12.18-debian
docker-pull node:4.8.5
docker-pull node:6.11.5
docker-pull node:8.8.1

docker-build 0.10.x-centos
docker-build 4.x-centos
docker-build 6.x-centos
docker-build 8.x-centos
