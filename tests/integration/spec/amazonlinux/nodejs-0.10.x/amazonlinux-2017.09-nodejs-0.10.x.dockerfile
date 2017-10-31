FROM amazonlinux:2017.09
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
