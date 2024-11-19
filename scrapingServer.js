const express = require('express');
const cors = require('cors'); // Importa cors
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'https://price-comparator-7jfh.onrender.com', // Cambia al dominio donde está tu frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    credentials: true, // Habilitar cookies si es necesario
  })
);

//app.use(cors());

app.get('/scrape', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'No se proporcionó un término de búsqueda' });
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const resultados = [];

  const tiendas = [
    {
      nombre: 'Mercado Libre',
      url: `https://listado.mercadolibre.com.mx/${query}`,
      productoSelector: '.poly-box.poly-component__title',
      precioSelector: '.andes-money-amount'
    },
    {
      nombre: 'Coppel',
      url: `https://www.coppel.com/SearchDisplay?storeId=10151&catalogId=10051&langId=-5&sType=SimpleSearch&searchType=search&searchSource=Q&pageView=mosaic&pageGroup=Search&pageSize=24&searchTerm=${query}`,
      productoSelector: '.chakra-text.css-1g6dv0g',
      precioSelector: '.chakra-text.css-1uqwphq'
    },
    {
      nombre: 'Amazon',
      url: `https://www.amazon.com.mx/s?k=${query}`,
      productoSelector: '.a-size-base-plus.a-color-base.a-text-normal',
      precioSelector: '.a-offscreen'
    }
  ];

  for (let tienda of tiendas) {
    try {
      await page.goto(tienda.url, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector(tienda.productoSelector);

      const producto = await page.evaluate((productoSelector, precioSelector) => {
        const nombre = document.querySelector(productoSelector)?.innerText || 'Producto no encontrado';
        const precio = document.querySelector(precioSelector)?.innerText || 'Precio no disponible';
        return { nombre, precio };
      }, tienda.productoSelector, tienda.precioSelector);

      resultados.push({ ...producto, tienda: tienda.nombre });
    } catch (error) {
      resultados.push({ nombre: 'Error', precio: 'Error al obtener datos', tienda: tienda.nombre });
    }
  }

  await browser.close();
  res.json(resultados);
});

app.listen(PORT, () => {
  console.log(`Servidor de scraping corriendo en http://localhost:${PORT}`);
});
