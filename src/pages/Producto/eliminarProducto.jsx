import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./producto.css";

// TODO backend: reemplazar por una llamada real, ej. service.obtenerProductoPorId(id)
const mockProductos = [
    { idProducto: 1, nombre: "Arroz Diana x 500g", precio: 3200 },
    { idProducto: 2, nombre: "Aceite Girasol x 1L", precio: 12500 },
    { idProducto: 3, nombre: "Leche Entera x 1L", precio: 4300 },
    { idProducto: 4, nombre: "Pan Tajado Integral", precio: 6800 },
    { idProducto: 5, nombre: "Detergente en Polvo x 3kg", precio: 21900 },
    { idProducto: 6, nombre: "Huevos AA x 30", precio: 15200 },
];

function EliminarProducto() {
    const navigate = useNavigate();
    const { id } = useParams();

    // ---- VERSIÓN ACTUAL (datos quemados, sin backend) ----
    const producto = mockProductos.find((p) => String(p.idProducto) === String(id)) || null;
    const [eliminando, setEliminando] = useState(false);

    //
    // import { useEffect } from "react";
    // const [producto, setProducto] = useState(null);
    // const [cargando, setCargando] = useState(true);
    //
    // useEffect(() => {
    //     const cargarProducto = async () => {
    //         setCargando(true);
    //         try {
    //             const respuesta = await service.obtenerProductoPorId(id);
    //             const data = respuesta?.data || respuesta;
    //             setProducto(data || null);
    //         } catch (error) {
    //             console.error("Error al cargar el producto:", error);
    //             setProducto(null);
    //         } finally {
    //             setCargando(false);
    //         }
    //     };
    //     cargarProducto();
    // }, [id]);

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(numero);
    };

    const handleEliminar = () => {
        setEliminando(true);
        // ---- VERSIÓN ACTUAL (sin backend, solo deja ver el flujo) ----
        console.log("Producto a eliminar:", id);
        setTimeout(() => {
            setEliminando(false);
            navigate("/productos");
        }, 300);

       
        // service.eliminarProducto(id)
        //     .then(() => navigate("/productos"))
        //     .catch((err) => {
        //         console.error("Error al eliminar el producto:", err);
        //         setEliminando(false);
        //     });
    };

    if (!producto) {
        return (
            <div className="producto-page">
                <div className="producto-container">
                    <div className="producto-body">
                        <p className="producto-empty">No se encontró el producto solicitado</p>
                        <div className="button-group">
                            <button className="btn btn-secondary" onClick={() => navigate("/productos")}>
                                Volver a productos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="producto-page">
            <div className="producto-container">
                <div className="producto-header">
                    <div>
                        <h1>Eliminar Producto</h1>
                        <p>Esta acción no se puede deshacer</p>
                    </div>
                </div>

                <div className="producto-body">
                    <div className="warning-box">
                        <h3>Vas a eliminar este producto</h3>
                        <p>Confirma que quieres eliminar permanentemente el siguiente producto del sistema.</p>
                    </div>

                    <div className="producto-card">
                        <div className="card-header">
                            <p className="card-title">{producto.nombre}</p>
                        </div>
                        <p className="card-info">
                            <strong>ID:</strong> {producto.idProducto}
                        </p>
                        <p className="card-info">
                            <strong>Precio:</strong> {formatearMoneda(producto.precio)}
                        </p>
                    </div>

                    <div className="button-group">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/productos")}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-delete"
                            onClick={handleEliminar}
                            disabled={eliminando}
                        >
                            {eliminando ? "Eliminando..." : "Sí, eliminar producto"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EliminarProducto;