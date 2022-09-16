FROM node:14.15.4-slim

RUN mkdir -p /usr/share/man/man1 && \
    apt update && apt install -y --no-install-recommends \
    git \
    ca-certificates \
    default-jre

USER node

WORKDIR /home/node/app

CMD [ "sh", "-c", "npm install && tail -f /dev/null" ]