import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";

import "./producto.css";

function ProductosPareja() {
    const navigate = useNavigate();

    const [pareja] = useState(() => {
        const storedUserData = localStorage.getItem("userData");
        return storedUserData ? JSON.parse(storedUserData) : null;
    });

    const [listaProductos, setListaProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (!role || role !== "pareja" || !pareja) {
            localStorage.clear();
            navigate("/");
            return;
        }

        const cargarProductosBackend = async () => {
            setCargando(true);
            try {
                const respuesta = await service.obtenerProductos();
                // El backend mapea directamente el List<ProductoDTO>
                const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
                setListaProductos(lista);
            } catch (error) {
                console.error("Error al traer productos para la pareja:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarProductosBackend();
    }, [pareja, navigate]);

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }).format(numero);
    };

    const productosFiltrados = listaProductos.filter((p) =>
        (p.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboardPareja">Panel</Link>
                        <Link to="/mis-compras">Mis Compras</Link>
                        <Link to="/productos/pareja" className="active">Productos</Link>
                    </nav>
                </div>

                <div className="main-grid" style={{ gridTemplateColumns: "1fr", marginTop: "20px" }}>
                    <div className="invested-card" style={{ width: "100%" }}>
                        <div className="col-title" style={{ marginBottom: "15px", display: "flex", justifyContent: "between", alignItems: "center" }}>
                            <span>Catálogo de Productos Disponibles</span>
                        </div>

                        <div className="search-box" style={{ marginBottom: "20px" }}>
                            <input
                                type="text"
                                placeholder="Buscar producto por nombre..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px 15px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "rgba(255,255,255,0.05)",
                                    color: "#fff",
                                    fontSize: "1rem"
                                }}
                            />
                        </div>

                        {cargando ? (
                            <p style={{ color: "#aaa", padding: "10px", textAlign: "center" }}>
                                Cargando catálogo desde el servidor...
                            </p>
                        ) : productosFiltrados.length === 0 ? (
                            <p style={{ color: "#aaa", padding: "10px", textAlign: "center" }}>
                                No se encontraron productos coincidentes.
                            </p>
                        ) : (
                             <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                gap: "20px",
                                marginTop: "10px"
                            }}>
                                {productosFiltrados.map((producto) => (
                                    <div className="mini-card" key={producto.idProducto} style={{ margin: 0, display: "flex", flexDirection: "column", justifyContent: "between" }}>
                                        <div>
                                            <span style={{ color: "#e8b84b", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>
                                                #{producto.idProducto}
                                            </span>
                                            <div className="mini-title" style={{ fontSize: "1.1rem", marginBottom: "10px", color: "#fff" }}>
                                                {producto.nombre}
                                            </div>
                                        </div>
                                        <p className="partner-meta" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4caf50", marginTop: "auto" }}>
                                            {formatearMoneda(producto.precio)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductosPareja;