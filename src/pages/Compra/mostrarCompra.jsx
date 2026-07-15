import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./compra.css";

function MostrarCompra({ 
  compras = [], 
  almacenes = [], 
  onVerDetalles, 
  onFiltrar,
  onBuscar,
  titulo = "Gestión de Compras",
  mostrarFiltroAlmacen = true,
  mostrarBotonVolver = true,
  rutaVolver = "/dashboardSupervisor"
}) {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [filtroAlmacen, setFiltroAlmacen] = useState("");
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleVerDetalles = (compra) => {
    setCompraSeleccionada(compra);
    setModalAbierto(true);
    if (onVerDetalles) {
      onVerDetalles(compra);
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setCompraSeleccionada(null);
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (onBuscar) {
      onBuscar(valor);
    }
  };

  const handleFiltroAlmacen = (e) => {
    const valor = e.target.value;
    setFiltroAlmacen(valor);
    if (onFiltrar) {
      onFiltrar(valor);
    }
  };

  const comprasFiltradas = compras.filter((compra) => {
    const matchAlmacen = filtroAlmacen === "" || compra.id_almacen?.toString() === filtroAlmacen;
    const termino = busqueda.toLowerCase();
    const parejaNombre = `${compra.pareja?.primerNombre || ""} ${compra.pareja?.primerApellido || ""}`.toLowerCase();
    const matchBusqueda = 
      compra.id_compra?.toString().includes(termino) || 
      parejaNombre.includes(termino) || 
      compra.fecha?.includes(termino);
    return matchAlmacen && matchBusqueda;
  });

  const formatearFecha = (f) => f ? f.split("-").reverse().join("/") : "-";
  const formatearHora = (h) => h ? h.substring(0, 5) : "-";

  return (
    <div className="compra-page">
      <div className="compra-container">
        <div className="compra-header">
          <h1>{titulo}</h1>

          {mostrarFiltroAlmacen && almacenes.length > 0 && (
            <div style={{ margin: "20px 0" }}>
              <label style={{ fontWeight: "bold", marginRight: "10px" }}>Filtrar por Almacén:</label>
              <select
                value={filtroAlmacen}
                onChange={handleFiltroAlmacen}
                style={{ padding: "8px", borderRadius: "5px", width: "200px" }}
              >
                <option value="">Todos los Almacenes</option>
                {almacenes.map((almacen) => (
                  <option key={almacen.id} value={almacen.id?.toString()}>
                    {almacen.nombre || `Almacén #${almacen.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mostrarBotonVolver && (
            <button className="btn btn-secondary" onClick={() => navigate(rutaVolver)}>
               Volver
            </button>
          )}
        </div>

        <div className="compra-body">
          <input 
            type="text" 
            placeholder="Buscar por ID, pareja o fecha..." 
            value={busqueda} 
            onChange={handleBusqueda} 
            className="search-box" 
          />

          {comprasFiltradas.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              No hay compras registradas
            </p>
          ) : (
            <table className="compra-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pareja</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comprasFiltradas.map((compra) => (
                  <tr key={compra.id_compra}>
                    <td>#{compra.id_compra}</td>
                    <td>{compra.pareja?.primerNombre} {compra.pareja?.primerApellido}</td>
                    <td>{formatearFecha(compra.fecha)}</td>
                    <td>{formatearHora(compra.hora)}</td>
                    <td>${compra.monto?.toLocaleString("es-CO") || 0}</td>
                    <td>
                      <button className="btn btn-detalle" onClick={() => handleVerDetalles(compra)}>
                        Ver productos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalAbierto && compraSeleccionada && (
        <div
          className="modal-overlay"
          onClick={handleCerrarModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex !important",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999999 !important"
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "15px",
              color: "black",
              width: "80%",
              maxWidth: "600px",
              display: "block !important",
              position: "relative"
            }}
          >
            <h3>Detalles de la Compra #{compraSeleccionada.id_compra}</h3>
            <p>
              <strong>Pareja:</strong> {compraSeleccionada.pareja?.primerNombre} {compraSeleccionada.pareja?.primerApellido}
            </p>
            <p>
              <strong>Fecha:</strong> {formatearFecha(compraSeleccionada.fecha)}
            </p>
            <p>
              <strong>Hora:</strong> {formatearHora(compraSeleccionada.hora)}
            </p>
            <p>
              <strong>Total:</strong> ${compraSeleccionada.monto?.toLocaleString("es-CO") || 0}
            </p>

            <table style={{ width: "100%", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cant</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {compraSeleccionada.productos?.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nombre}</td>
                    <td>${p.precio?.toLocaleString() || 0}</td>
                    <td>{p.cantidad}</td>
                    <td>${((p.precio || 0) * (p.cantidad || 0)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleCerrarModal}
              style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MostrarCompra;