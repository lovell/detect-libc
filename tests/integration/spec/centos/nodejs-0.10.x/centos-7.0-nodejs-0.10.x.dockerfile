FROM centos:7.0.1406
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
