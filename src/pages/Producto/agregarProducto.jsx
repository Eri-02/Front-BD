import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./producto.css";

function AgregarProducto() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "", precio: "" });
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
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
        console.log("Producto a crear:", {
            nombre: form.nombre.trim(),
            precio: parseFloat(form.precio) || 0,
        });
        setTimeout(() => {
            setGuardando(false);
            navigate("/productos");
        }, 300);

       
        // try {
        //     await service.crearProducto({
        //         nombre: form.nombre.trim(),
        //         precio: parseFloat(form.precio) || 0,
        //     });
        //     navigate("/productos");
        // } catch (err) {
        //     console.error("Error al agregar el producto:", err);
        //     setError("Ocurrió un error al guardar el producto");
        // } finally {
        //     setGuardando(false);
        // }
    };

    return (
        <div className="producto-page">
            <div className="producto-container">
                <div className="producto-header">
                    <div>
                        <h1>Agregar Producto</h1>
                        <p>Registra un nuevo producto en el sistema</p>
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
                                    placeholder="Ej. Arroz Diana x 500g"
                                    value={form.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    id="precio"
                                    placeholder="0"
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
                                {guardando ? "Guardando..." : "Guardar Producto"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AgregarProducto;