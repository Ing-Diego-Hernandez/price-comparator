#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias de npm
npm install


# (Opcional) Si tienes un paso de build para tu frontend, descomenta la siguiente línea:
npm run build


# Copiar la caché de Puppeteer a la ruta que Render espera
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "...Copiando la caché de Puppeteer desde el caché de construcción"
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
  echo "...Almacenando la caché de Puppeteer en el caché de construcción"
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi