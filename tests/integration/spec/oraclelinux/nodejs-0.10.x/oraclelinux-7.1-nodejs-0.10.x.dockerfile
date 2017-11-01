FROM oraclelinux:7.1
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
