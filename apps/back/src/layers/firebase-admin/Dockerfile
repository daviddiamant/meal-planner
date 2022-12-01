FROM amazonlinux as base

WORKDIR /app

RUN yum -y install make gcc* zip
RUN curl --silent --location https://rpm.nodesource.com/setup_16.x | bash -
RUN yum -y install nodejs

FROM base

COPY . .
RUN ["chmod", "+x", "build.sh"]
CMD ["sh", "build.sh"]