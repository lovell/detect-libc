FROM centos:7.3.1611
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
