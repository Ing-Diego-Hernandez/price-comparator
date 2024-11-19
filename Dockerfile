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

# Limpia el caché de npm
RUN npm cache clean --force

# Instala Puppeteer
RUN npm install puppeteer --save

# Establece las variables de entorno necesarias para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copia los archivos de tu proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Expone el puerto y ejecuta el servidor
EXPOSE 5000
CMD ["node", "src/scrapingServer.js"]
