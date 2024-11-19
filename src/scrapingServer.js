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
    },
    {
      nombre: 'Amazon',
      url: `https://www.amazon.com.mx/s?k=${query}`,
      productoSelector: '.a-size-base-plus.a-color-base.a-text-normal',
      precioSelector: '.a-offscreen',
    },
    {
      nombre: 'Temu',
      url: `https://www.temu.com/search_result.html?search_key=${query}&search_method=user`,
      productoSelector: '._2BvQbnbN.rE1Dn9Aq',
      precioSelector: '._382YgpSF._2de9ERAH',
    },
  ];

  const resultados = [];

  for (let tienda of tiendas) {
    try {
      console.log(`Scraping datos de ${tienda.nombre}...`);
      
      // Realizamos la solicitud HTTP con encabezados adicionales.
      const { data } = await axios.get(tienda.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9',
        },
        timeout: 10000, // Tiempo máximo de espera de 10 segundos
      });

      const $ = cheerio.load(data);

      // Buscamos el primer producto y precio
      const producto = $(tienda.productoSelector).first();
      const precio = $(tienda.precioSelector).first();

      const nombre = producto.text().trim();
      const precioTexto = precio.text().trim();

      if (nombre && precioTexto) {
        resultados.push({ nombre, precio: precioTexto, tienda: tienda.nombre });
      } else {
        console.warn(`No se encontraron datos válidos para ${tienda.nombre}.`);
        resultados.push({ nombre: 'Producto no encontrado', precio: 'Precio no disponible', tienda: tienda.nombre });
      }
    } catch (error) {
      console.error(`Error al obtener datos de ${tienda.nombre}:`, error.message);

      // Guardamos el error en los resultados
      resultados.push({ nombre: 'Error', precio: 'Error al obtener datos', tienda: tienda.nombre });
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
