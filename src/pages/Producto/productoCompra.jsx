import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./producto.css";

function ProductosCompra() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [comprando, setComprando] = useState(false);

    const [almacenes, setAlmacenes] = useState([]);
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
    const [mostrarModalAlmacen, setMostrarModalAlmacen] = useState(true);

    const [pareja] = useState(() => {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            try {
                return JSON.parse(storedUserData);
            } catch (e) {
                console.error("Error al parsear userData en ProductosCompra:", e);
                return null;
            }
        }
        return null;
    });

    const cupoConsumido = 0;
    const cupoAsignado = Number(pareja?.cupoAsignado) || 3000000;
    const cupoDisponible = cupoAsignado - cupoConsumido;

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [productosData, almacenesData] = await Promise.all([
                    service.obtenerProductos(),
                    service.obtenerAlmacenes()
                ]);

                const listaProductos =
                    productosData?.productos ||
                    productosData?.data ||
                    productosData ||
                    [];

                setProductos(listaProductos);
                setAlmacenes(almacenesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);
    const seleccionarAlmacen = (almacen) => {
        setAlmacenSeleccionado(almacen);
        setMostrarModalAlmacen(false);
    };

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }).format(numero);
    };

    const productosFiltrados = productos.filter((p) => {
        const termino = busqueda.toLowerCase();
        const nombre = p.nombre || p.nombreProducto || "";
        return nombre.toLowerCase().includes(termino);
    });

    const agregarAlCarrito = (producto) => {
        const idProducto = producto.id_producto || producto.idProducto;
        setCarrito((prev) => {
            const existente = prev.find((item) => (item.id_producto || item.idProducto) === idProducto);
            if (existente) {
                return prev.map((item) =>
                    (item.id_producto || item.idProducto) === idProducto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const eliminarDelCarrito = (id_producto) => {
        setCarrito((prev) => {
            const existente = prev.find((item) => (item.id_producto || item.idProducto) === id_producto);
            if (existente && existente.cantidad > 1) {
                return prev.map((item) =>
                    (item.id_producto || item.idProducto) === id_producto
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                );
            }
            return prev.filter((item) => (item.id_producto || item.idProducto) !== id_producto);
        });
    };

    const totalCarrito = carrito.reduce((sum, item) => {
        const precio = item.precio || item.precioProducto || 0;
        return sum + (precio * item.cantidad);
    }, 0);

    const handlePagar = () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        if (totalCarrito > cupoDisponible) {
            alert("No tienes suficiente cupo disponible");
            return;
        }
        setMostrarConfirmacion(true);
    };

    const confirmarPago = async () => {
        setComprando(true);
        try {

            const ahora = new Date();
            const fechaStr = ahora.toISOString().split("T")[0];
            const horaStr = ahora.toTimeString().split(" ")[0];

            const datosCompra = {
                idPareja: pareja?.idPareja || 1,
                idAlmacen: almacenSeleccionado.idAlmacen,
                monto: totalCarrito,
                fecha: fechaStr,
                hora: horaStr
            };

             const respuestaCompra = await service.registrarCompraPrincipal(datosCompra);
            const idCompraGenerado = respuestaCompra.idCompra;

            if (idCompraGenerado) {
                 for (const item of carrito) {
                    const idProducto = item.id_producto || item.idProducto;
      for (let i = 0; i < item.cantidad; i++) {
                        const datosDetalle = {
                            idCompra: idCompraGenerado,
                            idProducto: idProducto
                        };
                        await service.registrarProductoEnCompra(datosDetalle);
                    }
                }

                alert(`¡Compra realizada con éxito! Código de transacción: ${idCompraGenerado}`);
                setCarrito([]);
                setMostrarConfirmacion(false);
                navigate("/dashboardPareja");
            } else {
                alert("La compra fue procesada pero el servidor no retornó el ID correspondiente.");
            }

        } catch (error) {
            console.error("Error en la pasarela de compra:", error);
            const mensajeError = error.response?.data?.message || "Ocurrió un inconveniente al procesar el pago.";
            alert(`Error al pagar: ${mensajeError}`);
        } finally {
            setComprando(false);
        }
    };

    return (

        <div className="producto-page">
            {mostrarModalAlmacen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Seleccione un almacén</h3>
                        </div>

                        <div style={{ padding: "20px" }}>
                            <p>¿Desde qué almacén deseas comprar?</p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    marginTop: "20px"
                                }}
                            >
                                {almacenes.map((almacen) => (
                                    <button
                                        key={almacen.idAlmacen}
                                        className="btn btn-success"
                                        onClick={() => seleccionarAlmacen(almacen)}
                                    >
                                        {almacen.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="producto-container">
                <div className="producto-header">
                    <div>
                        <h1>Productos</h1>
                        <p>Selecciona los productos que deseas comprar desde la base de datos</p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboardPareja")}
                        disabled={comprando}
                    >
                         Volver al Dashboard
                    </button>
                </div>

                <div className="producto-body">
                    <div className="producto-content" style={{ display: "flex", gap: "24px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    disabled={comprando}
                                />
                            </div>

                            <div className="producto-grid">
                                {loading ? (
                                    <p className="producto-empty" style={{ color: "#e8b84b" }}>Cargando catálogo de productos...</p>
                                ) : productosFiltrados.length === 0 ? (
                                    <p className="producto-empty">No se encontraron productos</p>
                                ) : (
                                    productosFiltrados.map((p) => {
                                        const id = p.id_producto || p.idProducto;
                                        const nombre = p.nombre || p.nombreProducto || "Producto sin nombre";
                                        const precio = p.precio || p.precioProducto || 0;

                                        return (
                                            <div className="producto-item-card" key={id}>
                                                <p className="producto-item-name">{nombre}</p>
                                                <p className="producto-item-id">ID: {id}</p>
                                                <p className="producto-item-price">{formatearMoneda(precio)}</p>
                                                <div className="producto-item-actions">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => agregarAlCarrito(p)}
                                                        disabled={comprando}
                                                    >
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div style={{
                            width: "340px",
                            flexShrink: 0,
                            background: "var(--input)",
                            borderRadius: "16px",
                            padding: "20px",
                            maxHeight: "600px",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <h3 style={{
                                fontFamily: "'Fraunces', serif",
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "var(--text)",
                                margin: "0 0 12px"
                            }}>Carrito de Compras</h3>

                            <div style={{
                                padding: "12px 16px",
                                background: "var(--secondary-light)",
                                borderRadius: "10px",
                                marginBottom: "16px"
                            }}>
                                <p style={{ margin: 0, fontSize: "13px", fontWeight: "600" }}>
                                    Cupo disponible: <strong>{formatearMoneda(cupoDisponible)}</strong>
                                </p>
                            </div>

                            <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
                                {carrito.length === 0 ? (
                                    <p style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                                        No hay productos en el carrito
                                    </p>
                                ) : (
                                    carrito.map((item) => {
                                        const id = item.id_producto || item.idProducto;
                                        const nombre = item.nombre || item.nombreProducto;
                                        const precio = item.precio || item.precioProducto || 0;

                                        return (
                                            <div key={id} style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "10px 0",
                                                borderBottom: "1px solid var(--border)"
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>
                                                        {nombre}
                                                    </p>
                                                    <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                                                        {formatearMoneda(precio)}
                                                    </p>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            background: "var(--secondary-light)",
                                                            padding: "4px 10px",
                                                            fontSize: "14px",
                                                            borderRadius: "6px"
                                                        }}
                                                        onClick={() => eliminarDelCarrito(id)}
                                                        disabled={comprando}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontSize: "14px", fontWeight: "700", minWidth: "20px", textAlign: "center" }}>
                                                        {item.cantidad}
                                                    </span>
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            background: "var(--secondary-light)",
                                                            padding: "4px 10px",
                                                            fontSize: "14px",
                                                            borderRadius: "6px"
                                                        }}
                                                        onClick={() => agregarAlCarrito(item)}
                                                        disabled={comprando}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {carrito.length > 0 && (
                                <div style={{
                                    borderTop: "2px solid var(--border)",
                                    paddingTop: "16px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
                                        Total: <strong style={{ color: "var(--secondary)" }}>
                                        {formatearMoneda(totalCarrito)}
                                    </strong>
                                    </p>
                                    <button
                                        className="btn btn-success"
                                        style={{ padding: "12px 24px", fontSize: "14px" }}
                                        onClick={handlePagar}
                                        disabled={comprando}
                                    >
                                        Pagar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {mostrarConfirmacion && (
                <div className="modal-overlay" onClick={() => !comprando && setMostrarConfirmacion(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirmar Compra</h3>
                            {!comprando && <button className="btn-close" onClick={() => setMostrarConfirmacion(false)}>×</button>}
                        </div>

                        <div style={{ padding: "10px 0" }}>
                            <p style={{ fontSize: "15px", textAlign: "center", marginBottom: "16px" }}>
                                {comprando ? "Enviando datos al servidor..." : "¿Estás seguro de realizar esta compra?"}
                            </p>
                            <div style={{
                                background: "var(--input)",
                                borderRadius: "12px",
                                padding: "16px",
                                marginBottom: "20px"
                            }}>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Productos únicos:</strong> {carrito.length}
                                </p>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Total a descontar:</strong> {formatearMoneda(totalCarrito)}
                                </p>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Cupo disponible:</strong> {formatearMoneda(cupoDisponible)}
                                </p>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Cupo restante:</strong> {formatearMoneda(cupoDisponible - totalCarrito)}
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setMostrarConfirmacion(false)}
                                    style={{ padding: "10px 24px" }}
                                    disabled={comprando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={confirmarPago}
                                    style={{ padding: "10px 24px" }}
                                    disabled={comprando}
                                >
                                    {comprando ? "Procesando..." : "Aceptar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductosCompra;