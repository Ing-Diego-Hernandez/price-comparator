FROM node:16-slim

# Instala dependencias necesarias para Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends

# Instala Puppeteer
RUN npm install puppeteer --save

ENV PUPPERTEER_SKIP_CHROMIUN_DOWNLOAD=true \
    PUPPERTEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "src/scrapingServer.js" ]