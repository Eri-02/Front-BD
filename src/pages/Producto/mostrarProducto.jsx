import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./producto.css";

// TODO backend: reemplazar por una llamada real, ej. service.obtenerProductos()
const mockProductos = [
    { idProducto: 1, nombre: "Arroz Diana x 500g", precio: 3200, icono: "" },
    { idProducto: 2, nombre: "Aceite Girasol x 1L", precio: 12500, icono: "" },
    { idProducto: 3, nombre: "Leche Entera x 1L", precio: 4300, icono: "" },
    { idProducto: 4, nombre: "Pan Tajado Integral", precio: 6800, icono: "" },
    { idProducto: 5, nombre: "Detergente en Polvo x 3kg", precio: 21900, icono: "" },
    { idProducto: 6, nombre: "Huevos AA x 30", precio: 15200, icono: "" },
];

function MostrarProducto() {
    const navigate = useNavigate();

    // datos quemados, sin backend
    const [listaProductos] = useState(mockProductos);
    const [busqueda, setBusqueda] = useState("");

    
    // import { useEffect } from "react";
    // const [listaProductos, setListaProductos] = useState([]);
    // const [busqueda, setBusqueda] = useState("");
    // const [cargando, setCargando] = useState(true);
    //
    // useEffect(() => {
    //     const cargarProductos = async () => {
    //         setCargando(true);
    //         try {
    //             const respuesta = await service.obtenerProductos();
    //             const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
    //             setListaProductos(lista);
    //         } catch (error) {
    //             console.error("Error al cargar los productos:", error);
    //         } finally {
    //             setCargando(false);
    //         }
    //     };
    //     cargarProductos();
    // }, []);

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(numero);
    };

    const productosFiltrados = listaProductos.filter((producto) =>
        (producto.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="producto-page">
            <div className="producto-container">
                <div className="producto-header">
                    <div>
                        <h1>Catálogo de Productos</h1>
                        <p>Consulta y administra los productos disponibles en el sistema</p>
                    </div>
                    <button className="btn btn-success" onClick={() => navigate("/productos/agregar")}>
                        + Agregar Producto
                    </button>
                </div>

                <div className="producto-body">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {productosFiltrados.length === 0 ? (
                        <p className="producto-empty">No se encontraron productos</p>
                    ) : (
                        <div className="producto-grid">
                            {productosFiltrados.map((producto) => (
                                <div className="producto-item-card" key={producto.idProducto}>
                                    <p className="producto-item-id">#{producto.idProducto}</p>
                                    <p className="producto-item-name">{producto.nombre}</p>
                                    <p className="producto-item-price">{formatearMoneda(producto.precio)}</p>
                                    <div className="producto-item-actions">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() =>
                                                navigate(`/productos/editar/${producto.idProducto}`)
                                            }
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() =>
                                                navigate(`/productos/eliminar/${producto.idProducto}`)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MostrarProducto;