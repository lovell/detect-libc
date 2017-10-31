FROM amazonlinux:2016.09
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
