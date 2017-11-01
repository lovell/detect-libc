FROM centos:7.4.1708
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
