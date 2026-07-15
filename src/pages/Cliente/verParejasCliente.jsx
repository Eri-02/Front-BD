import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import service from "../../service/service";
import "./cliente.css";

function VerParejasCliente() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [cliente, setCliente] = useState(null);
    const [parejas, setParejas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            setError("");
            try {
                const respuestaCliente = await service.obtenerClientePorId(id);
                const clienteData =
                    respuestaCliente?.cliente || respuestaCliente?.data || respuestaCliente;
                setCliente(clienteData);

                const dataParejas = await service.obtenerParejasPorCliente(id);
                const lista = Array.isArray(dataParejas) ? dataParejas : (dataParejas?.data || []);
                setParejas(lista);
            } catch (err) {
                console.error("Error al cargar las parejas del cliente:", err);
                setError("No se pudieron cargar las parejas de este cliente");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [id]);

    return (
        <div className="cliente-page">
            <div className="cliente-container">
                <div className="cliente-header">
                    <h1>
                        Parejas de {cliente ? `${cliente.primerNombre} ${cliente.primerApellido}` : `Cliente #${id}`}
                    </h1>
                    <p>Parejas asociadas a este cliente y su cupo asignado</p>
                </div>

                <div className="cliente-body">
                    <div className="search-box">
                        <button className="btn btn-secondary" onClick={() => navigate("/supervisor/cliente")}>
                             Volver a clientes
                        </button>
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>Cargando parejas...</p>
                    ) : error ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#c0392b" }}>{error}</p>
                    ) : parejas.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            Este cliente no tiene parejas registradas
                        </p>
                    ) : (
                        <table className="cliente-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Primer Nombre</th>
                                    <th>Segundo Nombre</th>
                                    <th>Primer Apellido</th>
                                    <th>Segundo Apellido</th>
                                    <th>Correo Electrónico</th>
                                    <th>Cupo Asignado</th>
                                </tr>
                            </thead>

                            <tbody>
                                {parejas.map((p) => (
                                    <tr key={p.idPareja}>
                                        <td>{p.idPareja}</td>
                                        <td>{p.nombreUsuario}</td>
                                        <td>{p.primerNombre}</td>
                                        <td>{p.segundoNombre || "-"}</td>
                                        <td>{p.primerApellido}</td>
                                        <td>{p.segundoApellido || "-"}</td>
                                        <td>{p.correoElectronico}</td>
                                        <td>
                                            ${parseFloat(p.cupoAsignado || 0).toLocaleString("es-CO")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerParejasCliente;