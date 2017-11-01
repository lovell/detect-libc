FROM oraclelinux:6.9
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs
