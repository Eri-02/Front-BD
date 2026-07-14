import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./compra.css";

/*

        import { useEffect } from "react";
        const [listaCompras, setListaCompras] = useState([]);
        const [cargando, setCargando] = useState(true);
        
        useEffect(() => {
            const cargarCompras = async () => {
                setCargando(true);
                try {
                    const respuesta = await service.obtenerTodasLasCompras();
                    const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
                    setListaCompras(lista);
                } catch (error) {
                    console.error("Error al obtener las compras", error);
                } finally {
                    setCargando(false);
                }
            };
            cargarCompras();
        }, []);
        
    y borrar "comprasMock" junto con este comentario.
*/

const comprasMock = [
    {
        id_compra: 1,
        id_pareja: 1,
        id_almacen: 1,
        hora: "10:30:00",
        monto: 250000.00,
        fecha: "2026-01-15",
        pareja: {
            primerNombre: "Carlos",
            primerApellido: "Gómez"
        },
        productos: [
            { id_producto: 1, nombre: "Leche Entera", precio: 4500, cantidad: 3 },
            { id_producto: 2, nombre: "Pan Integral", precio: 3200, cantidad: 2 },
            { id_producto: 3, nombre: "Huevos", precio: 8000, cantidad: 1 }
        ]
    },
    {
        id_compra: 2,
        id_pareja: 2,
        id_almacen: 1,
        hora: "14:45:00",
        monto: 180000.00,
        fecha: "2026-01-15",
        pareja: {
            primerNombre: "María",
            primerApellido: "Rodríguez"
        },
        productos: [
            { id_producto: 4, nombre: "Arroz", precio: 3500, cantidad: 5 },
            { id_producto: 5, nombre: "Frijoles", precio: 4200, cantidad: 3 }
        ]
    },
    {
        id_compra: 3,
        id_pareja: 3,
        id_almacen: 2,
        hora: "09:15:00",
        monto: 350000.00,
        fecha: "2026-01-14",
        pareja: {
            primerNombre: "Luis",
            primerApellido: "Martínez"
        },
        productos: [
            { id_producto: 6, nombre: "Carne Molida", precio: 12000, cantidad: 2 },
            { id_producto: 7, nombre: "Pollo", precio: 9500, cantidad: 3 },
            { id_producto: 8, nombre: "Queso", precio: 8000, cantidad: 2 }
        ]
    },
    {
        id_compra: 4,
        id_pareja: 1,
        id_almacen: 1,
        hora: "16:20:00",
        monto: 95000.00,
        fecha: "2026-01-13",
        pareja: {
            primerNombre: "Carlos",
            primerApellido: "Gómez"
        },
        productos: [
            { id_producto: 9, nombre: "Yogur", precio: 2500, cantidad: 6 },
            { id_producto: 10, nombre: "Cereal", precio: 4800, cantidad: 2 }
        ]
    },
    {
        id_compra: 5,
        id_pareja: 4,
        id_almacen: 2,
        hora: "11:00:00",
        monto: 420000.00,
        fecha: "2026-01-12",
        pareja: {
            primerNombre: "Ana",
            primerApellido: "Torres"
        },
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
    const [cargando] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handleVerDetalles = (compra) => {
        setCompraSeleccionada(compra);
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setCompraSeleccionada(null);
    };

    const comprasFiltradas = listaCompras.filter((compra) => {
        if (!compra) return false;
        const termino = busqueda.toLowerCase();

        const idCompra = compra.id_compra.toString();
        const parejaNombre = `${compra.pareja?.primerNombre || ""} ${compra.pareja?.primerApellido || ""}`.toLowerCase();
        const fecha = compra.fecha || "";
        const monto = compra.monto?.toString() || "";

        return (
            idCompra.includes(termino) ||
            parejaNombre.includes(termino) ||
            fecha.includes(termino) ||
            monto.includes(termino)
        );
    });

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

    return (
        <div className="compra-page">
            <div className="compra-container">
                <div className="compra-header">
                    <div>
                        <h1>Gestión de Compras</h1>
                        <p>Consulta todas las compras realizadas en tu almacén</p>
                    </div>
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate("/dashboardSupervisor")}
                    >
                        ← Volver al Dashboard
                    </button>
                </div>

                <div className="compra-body">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por ID, pareja, fecha o monto..."
                            value={busqueda}
                            onChange={handleBusquedaChange}
                        />
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>Cargando compras...</p>
                    ) : comprasFiltradas.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            No se encontraron compras registradas
                        </p>
                    ) : (
                        <table className="compra-table">
                            <thead>
                                <tr>
                                    <th>ID Compra</th>
                                    <th>Pareja</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Monto</th>
                                    <th>Almacén</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {comprasFiltradas.map((compra) => (
                                    <tr key={compra.id_compra}>
                                        <td><strong>#{compra.id_compra}</strong></td>
                                        <td>
                                            {compra.pareja 
                                                ? `${compra.pareja.primerNombre} ${compra.pareja.primerApellido}`
                                                : `Pareja #${compra.id_pareja}`}
                                        </td>
                                        <td>{formatearFecha(compra.fecha)}</td>
                                        <td>{formatearHora(compra.hora)}</td>
                                        <td>
                                            <span className="monto-text">
                                                ${compra.monto.toLocaleString("es-CO")}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="almacen-badge">
                                                Almacén #{compra.id_almacen}
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
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL - Ventana emergente */}
            {modalAbierto && compraSeleccionada && (
                <div className="modal-overlay" onClick={handleCerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Detalles de la Compra #{compraSeleccionada.id_compra}</h3>
                            <button className="btn-close" onClick={handleCerrarModal}>×</button>
                        </div>

                        <div className="detalle-info">
                            <div className="info-item">
                                <strong>Pareja:</strong> 
                                <span>
                                    {compraSeleccionada.pareja 
                                        ? `${compraSeleccionada.pareja.primerNombre} ${compraSeleccionada.pareja.primerApellido}`
                                        : `Pareja #${compraSeleccionada.id_pareja}`}
                                </span>
                            </div>
                            <div className="info-item">
                                <strong>Fecha:</strong> 
                                <span>{formatearFecha(compraSeleccionada.fecha)}</span>
                            </div>
                            <div className="info-item">
                                <strong>Hora:</strong> 
                                <span>{formatearHora(compraSeleccionada.hora)}</span>
                            </div>
                            <div className="info-item">
                                <strong>Monto Total:</strong> 
                                <span className="monto-total">
                                    ${compraSeleccionada.monto.toLocaleString("es-CO")}
                                </span>
                            </div>
                            <div className="info-item">
                                <strong>Almacén:</strong> 
                                <span>Almacén #{compraSeleccionada.id_almacen}</span>
                            </div>
                        </div>

                        <div className="productos-compra">
                            <h4>Productos</h4>
                            <table className="productos-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Producto</th>
                                        <th>Precio Unitario</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compraSeleccionada.productos && compraSeleccionada.productos.length > 0 ? (
                                        compraSeleccionada.productos.map((producto) => (
                                            <tr key={producto.id_producto}>
                                                <td>{producto.id_producto}</td>
                                                <td>{producto.nombre}</td>
                                                <td>${producto.precio.toLocaleString("es-CO")}</td>
                                                <td>{producto.cantidad}</td>
                                                <td>
                                                    ${(producto.precio * producto.cantidad).toLocaleString("es-CO")}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                                No hay productos registrados para esta compra
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MostrarCompra;