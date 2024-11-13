import React, { useState, useEffect } from 'react';

function ComparadorPrecios() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    if (busqueda) {
      const resultados = [
        { id: 1, nombre: `${busqueda} A`, precio: 100, tienda: 'Tienda 1' },
        { id: 2, nombre: `${busqueda} B`, precio: 90, tienda: 'Tienda 2' },
        { id: 3, nombre: `${busqueda} C`, precio: 110, tienda: 'Tienda 3' },
      ];
      setProductos(resultados);

      const sugerenciasSimuladas = [
        { id: 4, nombre: `${busqueda} Similar 1`, precio: 85, tienda: 'Tienda 4' },
        { id: 5, nombre: `${busqueda} Similar 2`, precio: 95, tienda: 'Tienda 5' },
      ];
      setSugerencias(sugerenciasSimuladas);
    }
  }, [busqueda]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const configurarAlerta = (producto) => {
    alert(`Alerta configurada para ${producto.nombre}`);
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

      <div className="product-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="product-card">
            <h2>{producto.nombre}</h2>
            <p>{producto.tienda}</p>
            <p className="price">${producto.precio}</p>
            <button onClick={() => configurarAlerta(producto)} className="alert-button">
              Configurar alerta
            </button>
          </div>
        ))}
      </div>

      {sugerencias.length > 0 && (
        <div className="suggestions">
          <h2>Sugerencias</h2>
          <div className="suggestion-grid">
            {sugerencias.map((sugerencia) => (
              <div key={sugerencia.id} className="suggestion-card">
                <h3>{sugerencia.nombre}</h3>
                <p>{sugerencia.tienda}</p>
                <p className="price">${sugerencia.precio}</p>
                <span className="badge">Recomendado</span>
              </div>
            ))}
          </div>
        </div>
      )}

      
    </div>
  );
}

export default ComparadorPrecios;