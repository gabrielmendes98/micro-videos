FROM node:14.17.0-slim

RUN mkdir -p /usr/share/man/man1 && \
    apt update && apt install -y --no-install-recommends \
    git \
    ca-certificates \
    default-jre \
    procps

RUN npm install -g @nestjs/cli@8.2.5 npm@8.5.5

RUN usermod -u 268670508 node

USER node

WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]