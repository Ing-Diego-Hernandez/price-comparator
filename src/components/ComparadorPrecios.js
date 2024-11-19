import React, { useState } from 'react';

function ComparadorPrecios() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const response = await fetch(`https://back-end-price-comparator.onrender.com/scrape?query=${encodeURIComponent(busqueda)}`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }

    setCargando(false);
  };

  return (
    <div className="container">
      <h1 className="title">Comparador de Precios Inteligente</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Buscar</button>
      </form>

      {cargando && <p>Cargando resultados...</p>}

      <div className="product-grid">
        {productos.map((producto, index) => (
          <div key={index} className="product-card">
            <h2>{producto.nombre}</h2>
            <p>{producto.tienda}</p>
            <p className="price">${producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparadorPrecios;
