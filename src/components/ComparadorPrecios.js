import React, { useState } from 'react';
import './ComparadorPrecios.css';

function ComparadorPrecios() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const response = await fetch(`/scrape?query=${encodeURIComponent(busqueda)}`);
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
            <img src={producto.imagen} alt={producto.nombre} width="200" height="200"/>
            <p className="price"><strong>Precio: </strong>{producto.precio}</p>
            <p><strong>Tienda: </strong>{producto.tienda}</p>
            <a href={producto.link} target="_blank" rel="noopener noreferrer" class="button">Ver producto</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparadorPrecios;
