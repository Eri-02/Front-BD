import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./producto.css";

// TODO backend: reemplazar por una llamada real, ej. service.obtenerProductoPorId(id).
// Esta misma lista se usa (quemada) en MostrarProducto y EliminarProducto; en cuanto
// exista el endpoint, las tres pantallas deben consumir los mismos datos reales.
const mockProductos = [
    { idProducto: 1, nombre: "Arroz Diana x 500g", precio: 3200 },
    { idProducto: 2, nombre: "Aceite Girasol x 1L", precio: 12500 },
    { idProducto: 3, nombre: "Leche Entera x 1L", precio: 4300 },
    { idProducto: 4, nombre: "Pan Tajado Integral", precio: 6800 },
    { idProducto: 5, nombre: "Detergente en Polvo x 3kg", precio: 21900 },
    { idProducto: 6, nombre: "Huevos AA x 30", precio: 15200 },
];

function EditarProducto() {
    const navigate = useNavigate();
    const { id } = useParams();

    // ---- VERSIÓN ACTUAL (datos quemados, sin backend) ----
    const productoExistente = mockProductos.find((p) => String(p.idProducto) === String(id));
    const noEncontrado = !productoExistente;

    const [form, setForm] = useState(() => ({
        nombre: productoExistente?.nombre || "",
        precio: productoExistente ? String(productoExistente.precio) : "",
    }));
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);


    // import { useEffect } from "react";
    // const [form, setForm] = useState({ nombre: "", precio: "" });
    // const [error, setError] = useState("");
    // const [guardando, setGuardando] = useState(false);
    // const [cargando, setCargando] = useState(true);
    // const [noEncontrado, setNoEncontrado] = useState(false);
    //
    // useEffect(() => {
    //     const cargarProducto = async () => {
    //         setCargando(true);
    //         try {
    //             const respuesta = await service.obtenerProductoPorId(id);
    //             const data = respuesta?.data || respuesta;
    //             if (!data) {
    //                 setNoEncontrado(true);
    //             } else {
    //                 setForm({ nombre: data.nombre, precio: String(data.precio) });
    //             }
    //         } catch (error) {
    //             console.error("Error al cargar el producto:", error);
    //             setNoEncontrado(true);
    //         } finally {
    //             setCargando(false);
    //         }
    //     };
    //     cargarProducto();
    // }, [id]);

    const handleChange = (e) => {
        const { id: campo, value } = e.target;
        setForm((prev) => ({ ...prev, [campo]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!form.nombre.trim()) {
            setError("El nombre del producto es obligatorio");
            return;
        }
        if (!form.precio || Number(form.precio) <= 0) {
            setError("El precio debe ser mayor a 0");
            return;
        }

        setGuardando(true);
        // ---- VERSIÓN ACTUAL (sin backend, solo deja ver el flujo) ----
        console.log("Producto a actualizar:", {
            idProducto: id,
            nombre: form.nombre.trim(),
            precio: parseFloat(form.precio) || 0,
        });
        setTimeout(() => {
            setGuardando(false);
            navigate("/productos");
        }, 300);

      
        // try {
        //     await service.editarProducto(id, {
        //         nombre: form.nombre.trim(),
        //         precio: parseFloat(form.precio) || 0,
        //     });
        //     navigate("/productos");
        // } catch (err) {
        //     console.error("Error al editar el producto:", err);
        //     setError("Ocurrió un error al guardar los cambios");
        // } finally {
        //     setGuardando(false);
        // }
    };

    if (noEncontrado) {
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
                        <h1>Editar Producto</h1>
                        <p>Actualiza la información del producto #{id}</p>
                    </div>
                </div>

                <div className="producto-body">
                    <p className="section-title">Datos del producto</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid single-col">
                            <div className="field">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    id="precio"
                                    min="0"
                                    step="100"
                                    value={form.precio}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <p style={{ color: "#c0392b", fontSize: "13px", marginBottom: "16px" }}>
                                {error}
                            </p>
                        )}

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/productos")}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success" disabled={guardando}>
                                {guardando ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditarProducto;