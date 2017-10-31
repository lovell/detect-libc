FROM centos:6.8
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
