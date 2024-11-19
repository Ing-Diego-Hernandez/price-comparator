const path = require('path');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../build')));

const scrapeProducts = async (query) => {
  const tiendas = [
    {
      nombre: 'Mercado Libre',
      url: `https://listado.mercadolibre.com.mx/${query}`,
      productoSelector: '.poly-box.poly-component__title',
      precioSelector: '.andes-money-amount',
      imagenSelector: '.poly-component__picture',
      linkSelector: '.poly-box.poly-component__title a',
    },
    {
      nombre: 'Amazon',
      url: `https://www.amazon.com.mx/s?k=${query}`,
      productoSelector: '.a-size-base-plus.a-color-base.a-text-normal',
      precioSelector: '.a-offscreen',
      imagenSelector: '.s-image',
      linkSelector: '.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal',
    },
    {
      nombre: 'Temu',
      url: `https://www.temu.com/search_result.html?search_key=${query}&search_method=user`,
      productoSelector: '._2BvQbnbN.rE1Dn9Aq',
      precioSelector: '._382YgpSF._2de9ERAH',
      imagenSelector: '.lazy-iamge._3frBeExl.goods-img-external.loaded',
      linkSelector: '._2Tl9qLr1._1ak1dai3',
    },
  ];

  const resultados = [];

  for (let tienda of tiendas) {
    try {
      const { data } = await axios.get(tienda.url);
      const $ = cheerio.load(data);

      const producto = $(tienda.productoSelector).first();
      const precio = $(tienda.precioSelector).first();
      const imagen = $(tienda.imagenSelector).first();
      const link = $(tienda.linkSelector).first();

      const nombre = producto.text().trim();
      const precioTexto = precio.text().trim();
      const imagenUrl = imagen.attr('src') || imagen.attr('data-src'); // Algunos sitios usan "data-src"
      const productoUrl = link.attr('href');

      if (nombre && precioTexto) {
        resultados.push({
          nombre,
          precio: precioTexto,
          imagen: imagenUrl || 'Imagen no disponible',
          link: productoUrl
            ? (productoUrl.startsWith('http') ? productoUrl : `${tienda.url}${productoUrl}`)
            : 'Enlace no disponible',
          tienda: tienda.nombre,
        });
      } else {
        resultados.push({
          nombre: 'Producto no encontrado',
          precio: 'Precio no disponible',
          imagen: 'Imagen no disponible',
          link: 'Enlace no disponible',
          tienda: tienda.nombre,
        });
      }
    } catch (error) {
      console.error(`Error al obtener datos de ${tienda.nombre}:`, error.message);
      resultados.push({
        nombre: 'Error',
        precio: 'Error al obtener datos',
        imagen: 'Error al obtener imagen',
        link: 'Error al obtener enlace',
        tienda: tienda.nombre,
      });
    }
  }

  return resultados;
};

app.get('/scrape', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'No se proporcionó un término de búsqueda' });
  }

  const productos = await scrapeProducts(query);
  res.json(productos);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
