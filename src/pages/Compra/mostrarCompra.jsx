import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./compra.css";

const comprasMock = [
    {
        id_compra: 1, id_pareja: 1, id_almacen: 1, hora: "10:30:00", monto: 250000.00, fecha: "2026-01-15",
        pareja: { primerNombre: "Carlos", primerApellido: "Gómez" },
        productos: [
            { id_producto: 1, nombre: "Leche Entera", precio: 4500, cantidad: 3 },
            { id_producto: 2, nombre: "Pan Integral", precio: 3200, cantidad: 2 },
            { id_producto: 3, nombre: "Huevos", precio: 8000, cantidad: 1 }
        ]
    },
    {
        id_compra: 2, id_pareja: 2, id_almacen: 1, hora: "14:45:00", monto: 180000.00, fecha: "2026-01-15",
        pareja: { primerNombre: "María", primerApellido: "Rodríguez" },
        productos: [
            { id_producto: 4, nombre: "Arroz", precio: 3500, cantidad: 5 },
            { id_producto: 5, nombre: "Frijoles", precio: 4200, cantidad: 3 }
        ]
    },
    {
        id_compra: 3, id_pareja: 3, id_almacen: 2, hora: "09:15:00", monto: 350000.00, fecha: "2026-01-14",
        pareja: { primerNombre: "Luis", primerApellido: "Martínez" },
        productos: [
            { id_producto: 6, nombre: "Carne Molida", precio: 12000, cantidad: 2 },
            { id_producto: 7, nombre: "Pollo", precio: 9500, cantidad: 3 },
            { id_producto: 8, nombre: "Queso", precio: 8000, cantidad: 2 }
        ]
    },
    {
        id_compra: 4, id_pareja: 1, id_almacen: 1, hora: "16:20:00", monto: 95000.00, fecha: "2026-01-13",
        pareja: { primerNombre: "Carlos", primerApellido: "Gómez" },
        productos: [
            { id_producto: 9, nombre: "Yogur", precio: 2500, cantidad: 6 },
            { id_producto: 10, nombre: "Cereal", precio: 4800, cantidad: 2 }
        ]
    },
    {
        id_compra: 5, id_pareja: 4, id_almacen: 2, hora: "11:00:00", monto: 420000.00, fecha: "2026-01-12",
        pareja: { primerNombre: "Ana", primerApellido: "Torres" },
        productos: [
            { id_producto: 11, nombre: "Aceite", precio: 5500, cantidad: 4 },
            { id_producto: 12, nombre: "Azúcar", precio: 3800, cantidad: 3 },
            { id_producto: 13, nombre: "Harina", precio: 2800, cantidad: 5 },
            { id_producto: 14, nombre: "Levadura", precio: 1500, cantidad: 2 }
        ]
    }
];

function MostrarCompra() {
    const navigate = useNavigate();
    const [listaCompras] = useState(comprasMock);
    const [busqueda, setBusqueda] = useState("");
    const [filtroAlmacen, setFiltroAlmacen] = useState("");
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleVerDetalles = (compra) => {
        setCompraSeleccionada(compra);
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setCompraSeleccionada(null);
    };

    const comprasFiltradas = listaCompras.filter((compra) => {
        const matchAlmacen = filtroAlmacen === "" || compra.id_almacen.toString() === filtroAlmacen;
        const termino = busqueda.toLowerCase();
        const parejaNombre = `${compra.pareja?.primerNombre || ""} ${compra.pareja?.primerApellido || ""}`.toLowerCase();
        const matchBusqueda = compra.id_compra.toString().includes(termino) || parejaNombre.includes(termino) || compra.fecha.includes(termino);
        return matchAlmacen && matchBusqueda;
    });

    const formatearFecha = (f) => f ? f.split("-").reverse().join("/") : "-";
    const formatearHora = (h) => h ? h.substring(0, 5) : "-";

    return (
        <div className="compra-page">
            <div className="compra-container">
                <div className="compra-header">
                    <h1>Gestión de Compras</h1>

                    <div style={{ margin: "20px 0" }}>
                        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Filtrar por Almacén:</label>
                        <select
                            value={filtroAlmacen}
                            onChange={(e) => setFiltroAlmacen(e.target.value)}
                            style={{ padding: "8px", borderRadius: "5px", width: "200px" }}
                        >
                            <option value="">Todos los Almacenes</option>
                            <option value="1">Almacén #1</option>
                            <option value="2">Almacén #2</option>
                        </select>
                    </div>

                    <button className="btn btn-secondary" onClick={() => navigate("/dashboardSupervisor")}>← Volver</button>
                </div>

                <div className="compra-body">
                    <input type="text" placeholder="Buscar por ID, pareja o fecha..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="search-box" />

                    <table className="compra-table">
                        <thead>
                        <tr><th>ID</th><th>Pareja</th><th>Fecha</th><th>Hora</th><th>Monto</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                        {comprasFiltradas.map((compra) => (
                            <tr key={compra.id_compra}>
                                <td>#{compra.id_compra}</td>
                                <td>{compra.pareja?.primerNombre} {compra.pareja?.primerApellido}</td>
                                <td>{formatearFecha(compra.fecha)}</td>
                                <td>{formatearHora(compra.hora)}</td>
                                <td>${compra.monto.toLocaleString("es-CO")}</td>
                                <td><button className="btn btn-detalle" onClick={() => handleVerDetalles(compra)}>Ver productos</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                        <p><strong>Pareja:</strong> {compraSeleccionada.pareja?.primerNombre} {compraSeleccionada.pareja?.primerApellido}</p>

                        <table style={{ width: "100%", marginTop: "20px" }}>
                            <thead>
                            <tr><th>Producto</th><th>Precio</th><th>Cant</th></tr>
                            </thead>
                            <tbody>
                            {compraSeleccionada.productos?.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.nombre}</td>
                                    <td>${p.precio?.toLocaleString()}</td>
                                    <td>{p.cantidad}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <button
                            onClick={handleCerrarModal}
                            style={{ marginTop: "20px", padding: "10px 20px" }}
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