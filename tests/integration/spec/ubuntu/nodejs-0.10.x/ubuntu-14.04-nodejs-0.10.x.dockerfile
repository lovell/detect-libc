FROM ubuntu:14.04
RUN apt-get update && apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_0.10 | bash -
RUN apt-get install -y nodejs
