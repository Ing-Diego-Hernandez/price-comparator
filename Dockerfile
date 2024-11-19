FROM ghcr.io/pupperteer/pupperteer:23.8.0

ENV PUPPERTEER_SKIP_CHROMIUN_DOWNLOAD=true \
    PUPPERTEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "src/scrapingServer.js" ]