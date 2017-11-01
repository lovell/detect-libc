FROM ubuntu:16.04
RUN apt-get update && apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install -y nodejs=0.12.18-1nodesource1~xenial1
