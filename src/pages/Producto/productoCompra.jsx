import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./producto.css";

const productosQuemados = [
    { id_producto: 1, nombre: "Leche Entera", precio: 4500 },
    { id_producto: 2, nombre: "Pan Integral", precio: 3200 },
    { id_producto: 3, nombre: "Huevos", precio: 8000 },
    { id_producto: 4, nombre: "Arroz", precio: 3500 },
    { id_producto: 5, nombre: "Frijoles", precio: 4200 },
    { id_producto: 6, nombre: "Carne Molida", precio: 12000 },
    { id_producto: 7, nombre: "Pollo", precio: 9500 },
    { id_producto: 8, nombre: "Queso", precio: 8000 },
    { id_producto: 9, nombre: "Yogur", precio: 2500 },
    { id_producto: 10, nombre: "Cereal", precio: 4800 },
    { id_producto: 11, nombre: "Aceite", precio: 5500 },
    { id_producto: 12, nombre: "Azúcar", precio: 3800 },
];

function ProductosCompra() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const cupoDisponible = 1850000;

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }).format(numero);
    };

    const productosFiltrados = productosQuemados.filter((p) => {
        const termino = busqueda.toLowerCase();
        return p.nombre.toLowerCase().includes(termino);
    });

    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existente = prev.find((item) => item.id_producto === producto.id_producto);
            if (existente) {
                return prev.map((item) =>
                    item.id_producto === producto.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const eliminarDelCarrito = (id_producto) => {
        setCarrito((prev) => {
            const existente = prev.find((item) => item.id_producto === id_producto);
            if (existente && existente.cantidad > 1) {
                return prev.map((item) =>
                    item.id_producto === id_producto
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                );
            }
            return prev.filter((item) => item.id_producto !== id_producto);
        });
    };

    const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

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

    const confirmarPago = () => {
        setMostrarConfirmacion(false);
        alert(`¡Compra realizada con éxito! Total: ${formatearMoneda(totalCarrito)}`);
        setCarrito([]);
    };

    return (
        <div className="producto-page">
            <div className="producto-container">
                <div className="producto-header">
                    <div>
                        <h1>Productos</h1>
                        <p>Selecciona los productos que deseas comprar</p>
                    </div>
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate("/dashboardPareja")}
                    >
                        ← Volver al Dashboard
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
                                />
                            </div>

                            <div className="producto-grid">
                                {productosFiltrados.length === 0 ? (
                                    <p className="producto-empty">No se encontraron productos</p>
                                ) : (
                                    productosFiltrados.map((p) => (
                                        <div className="producto-item-card" key={p.id_producto}>
                                            <p className="producto-item-name">{p.nombre}</p>
                                            <p className="producto-item-id">ID: {p.id_producto}</p>
                                            <p className="producto-item-price">{formatearMoneda(p.precio)}</p>
                                            <div className="producto-item-actions">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => agregarAlCarrito(p)}
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    ))
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
                                    carrito.map((item) => (
                                        <div key={item.id_producto} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            borderBottom: "1px solid var(--border)"
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>
                                                    {item.nombre}
                                                </p>
                                                <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                                                    {formatearMoneda(item.precio)}
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
                                                    onClick={() => eliminarDelCarrito(item.id_producto)}
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
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))
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
                <div className="modal-overlay" onClick={() => setMostrarConfirmacion(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirmar Compra</h3>
                            <button className="btn-close" onClick={() => setMostrarConfirmacion(false)}>×</button>
                        </div>

                        <div style={{ padding: "10px 0" }}>
                            <p style={{ fontSize: "15px", textAlign: "center", marginBottom: "16px" }}>
                                ¿Estás seguro de realizar esta compra?
                            </p>
                            <div style={{
                                background: "var(--input)",
                                borderRadius: "12px",
                                padding: "16px",
                                marginBottom: "20px"
                            }}>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Productos:</strong> {carrito.length}
                                </p>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Total:</strong> {formatearMoneda(totalCarrito)}
                                </p>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Cupo disponible:</strong> {formatearMoneda(cupoDisponible)}
                                </p>
                                <p style={{ fontSize: "14px", margin: "6px 0" }}>
                                    <strong>Saldo después:</strong> {formatearMoneda(cupoDisponible - totalCarrito)}
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setMostrarConfirmacion(false)}
                                    style={{ padding: "10px 24px" }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={confirmarPago}
                                    style={{ padding: "10px 24px" }}
                                >
                                    Aceptar
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