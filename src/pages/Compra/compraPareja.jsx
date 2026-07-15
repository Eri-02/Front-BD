import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./compra.css";

function CompraPareja({ 
  compras = [], 
  almacenes = [],
  onVerDetalles,
  onBuscar,
  titulo = "Mis Compras",
  subtitulo = "Historial de todas tus compras realizadas",
  mostrarBotonVolver = true,
  rutaVolver = "/dashboardPareja"
}) {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const formatearMoneda = (valor) => {
    const numero = Number(valor) || 0;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(numero);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const formatearHora = (hora) => {
    if (!hora) return "-";
    const partes = hora.split(":");
    return `${partes[0]}:${partes[1]}`;
  };

  const obtenerNombreAlmacen = (idAlmacen) => {
    const almacen = almacenes.find(a => a.id_almacen === idAlmacen || a.id === idAlmacen);
    return almacen?.nombre || almacen?.nombreAlmacen || `Almacén #${idAlmacen}`;
  };

  const comprasFiltradas = compras.filter((c) => {
    const termino = busqueda.toLowerCase();
    const fecha = c.fecha || "";
    const monto = c.monto?.toString() || "";
    const almacen = obtenerNombreAlmacen(c.id_almacen).toLowerCase();

    return fecha.includes(termino) ||
           monto.includes(termino) ||
           almacen.includes(termino);
  });

  const handleVerDetalles = (compra) => {
    setCompraSeleccionada(compraSeleccionada?.id_compra === compra.id_compra ? null : compra);
    if (onVerDetalles) {
      onVerDetalles(compra);
    }
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (onBuscar) {
      onBuscar(valor);
    }
  };

  return (
    <div className="compra-page">
      <div className="compra-container">
        <div className="compra-header">
          <div>
            <h1>{titulo}</h1>
            <p>{subtitulo}</p>
          </div>
          {mostrarBotonVolver && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate(rutaVolver)}
            >
              ← Volver al Dashboard
            </button>
          )}
        </div>

        <div className="compra-body">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por fecha, monto o almacén..."
              value={busqueda}
              onChange={handleBusqueda}
            />
          </div>

          <div className="compra-content">
            <div className="tabla-wrapper">
              <table className="compra-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Monto</th>
                    <th>Almacén</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                        No se encontraron compras
                      </td>
                    </tr>
                  ) : (
                    comprasFiltradas.map((compra) => (
                      <tr key={compra.id_compra}>
                        <td><strong>#{compra.id_compra}</strong></td>
                        <td>{formatearFecha(compra.fecha)}</td>
                        <td>{formatearHora(compra.hora)}</td>
                        <td className="monto-text">{formatearMoneda(compra.monto)}</td>
                        <td>
                          <span className="almacen-badge">
                            {obtenerNombreAlmacen(compra.id_almacen)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-detalle"
                            onClick={() => handleVerDetalles(compra)}
                          >
                            Ver productos
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {compraSeleccionada && (
              <div className="detalle-compra">
                <div className="detalle-header">
                  <h3>Compra #{compraSeleccionada.id_compra}</h3>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCompraSeleccionada(null)}
                    style={{ padding: "6px 12px", fontSize: "11px" }}
                  >
                    Cerrar
                  </button>
                </div>

                <div className="detalle-info">
                  <div className="info-item">
                    <strong>Fecha</strong>
                    <span>{formatearFecha(compraSeleccionada.fecha)}</span>
                  </div>
                  <div className="info-item">
                    <strong>Hora</strong>
                    <span>{formatearHora(compraSeleccionada.hora)}</span>
                  </div>
                  <div className="info-item">
                    <strong>Monto Total</strong>
                    <span className="monto-total">{formatearMoneda(compraSeleccionada.monto)}</span>
                  </div>
                  <div className="info-item">
                    <strong>Almacén</strong>
                    <span>{obtenerNombreAlmacen(compraSeleccionada.id_almacen)}</span>
                  </div>
                </div>

                <div className="productos-compra">
                  <h4>Productos</h4>
                  <table className="productos-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compraSeleccionada.productos && compraSeleccionada.productos.length > 0 ? (
                        compraSeleccionada.productos.map((producto) => (
                          <tr key={producto.id_producto || producto.id}>
                            <td>{producto.nombre}</td>
                            <td>{formatearMoneda(producto.precio)}</td>
                            <td>{producto.cantidad}</td>
                            <td>{formatearMoneda(producto.precio * producto.cantidad)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            No hay productos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraPareja;