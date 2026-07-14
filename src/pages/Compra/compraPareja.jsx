import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./compra.css";

const comprasQuemadas = [
    {
        id_compra: 1,
        fecha: "2026-07-10",
        hora: "14:30",
        monto: 420000,
        id_almacen: 1,
        productos: [
            { id_producto: 1, nombre: "Leche Entera", precio: 4500, cantidad: 3 },
            { id_producto: 2, nombre: "Pan Integral", precio: 3200, cantidad: 2 },
            { id_producto: 3, nombre: "Huevos", precio: 8000, cantidad: 1 }
        ]
    },
    {
        id_compra: 2,
        fecha: "2026-07-08",
        hora: "10:15",
        monto: 180000,
        id_almacen: 2,
        productos: [
            { id_producto: 4, nombre: "Arroz", precio: 3500, cantidad: 5 },
            { id_producto: 5, nombre: "Frijoles", precio: 4200, cantidad: 3 }
        ]
    },
    {
        id_compra: 3,
        fecha: "2026-07-05",
        hora: "19:02",
        monto: 650000,
        id_almacen: 1,
        productos: [
            { id_producto: 6, nombre: "Carne Molida", precio: 12000, cantidad: 2 },
            { id_producto: 7, nombre: "Pollo", precio: 9500, cantidad: 3 },
            { id_producto: 8, nombre: "Queso", precio: 8000, cantidad: 2 }
        ]
    },
];

const almacenesQuemados = [
    { id_almacen: 1, nombre: "Almacén Centro" },
    { id_almacen: 2, nombre: "Almacén Norte" },
];

function CompraPareja() {
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

    const comprasFiltradas = comprasQuemadas.filter((c) => {
        const termino = busqueda.toLowerCase();
        const fecha = c.fecha || "";
        const monto = c.monto?.toString() || "";
        const almacen = almacenesQuemados.find(a => a.id_almacen === c.id_almacen)?.nombre?.toLowerCase() || "";

        return fecha.includes(termino) ||
               monto.includes(termino) ||
               almacen.includes(termino);
    });

    const handleVerDetalles = (compra) => {
        setCompraSeleccionada(compraSeleccionada?.id_compra === compra.id_compra ? null : compra);
    };

    return (
        <div className="compra-page">
            <div className="compra-container">
                <div className="compra-header">
                    <div>
                        <h1>Mis Compras</h1>
                        <p>Historial de todas tus compras realizadas</p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboardPareja")}
                    >
                        ← Volver al Dashboard
                    </button>
                </div>

                <div className="compra-body">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por fecha, monto o almacén..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
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
                                                        {almacenesQuemados.find(a => a.id_almacen === compra.id_almacen)?.nombre || compra.id_almacen}
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
                                        <span>{almacenesQuemados.find(a => a.id_almacen === compraSeleccionada.id_almacen)?.nombre || compraSeleccionada.id_almacen}</span>
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
                                                    <tr key={producto.id_producto}>
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