FROM centos:7.1.1503
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
