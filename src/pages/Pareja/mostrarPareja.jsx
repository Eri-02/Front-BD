import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../service/service";
import "./pareja.css";

function MostrarPareja() {
    const navigate = useNavigate();

    const [listaParejas, setListaParejas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarParejas = async () => {
            try {
                const usuarioLogueado = JSON.parse(localStorage.getItem("userData"));
                const idCliente = usuarioLogueado?.idCliente || usuarioLogueado?.id;

                if (idCliente) {
                    const datosBackend = await authService.obtenerParejasPorCliente(idCliente);

                    if (Array.isArray(datosBackend)) {
                        setListaParejas(datosBackend);
                    } else {
                        setListaParejas([]);
                    }
                } else {
                    console.warn("No se encontró un cliente");
                }
            } catch (error) {
                console.error("Error al obtener las parejas", error);
            } finally {
                setCargando(false);
            }
        };

        cargarParejas();
    }, []);

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const parejasFiltradas = listaParejas.filter((pareja) => {
        if (!pareja) return false;
        const termino = busqueda.toLowerCase();

        const primerNombre = (pareja.primerNombre || "").toLowerCase();
        const primerApellido = (pareja.primerApellido || "").toLowerCase();
        const nombreUsuario = (pareja.nombreUsuario || "").toLowerCase();
        const correo = (pareja.correoElectronico || "").toLowerCase();

        return primerNombre.includes(termino) ||
            primerApellido.includes(termino) ||
            nombreUsuario.includes(termino) ||
            correo.includes(termino);
    });

    return (
        <div className="pareja-page">
            <div className="pareja-container">

                <div className="pareja-header">
                    <h1>Gestión de Parejas</h1>
                    <p>Consulta todas las parejas registradas </p>
                </div>

                <div className="pareja-body">

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, usuario o correo..."
                            value={busqueda}
                            onChange={handleBusquedaChange}
                        />

                        <button
                            className="btn btn-success"
                            onClick={() => navigate("/parejas/agregar")}
                        >
                            Agregar Pareja
                        </button>
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>Cargando parejas...</p>
                    ) : parejasFiltradas.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            No se encontraron parejas registradas para este cliente
                        </p>
                    ) : (
                        <table className="pareja-table">
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
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {parejasFiltradas.map((pareja) => {

                                const idActual = pareja.idPareja;

                                return (
                                    <tr key={idActual}>
                                        <td>{idActual}</td>
                                        <td>{pareja.nombreUsuario}</td>
                                        <td>{pareja.primerNombre}</td>
                                        <td>{pareja.segundoNombre || "-"}</td>
                                        <td>{pareja.primerApellido}</td>
                                        <td>{pareja.segundoApellido || "-"}</td>
                                        <td>{pareja.correoElectronico}</td>

                                        <td>${parseFloat(pareja.cupoAsignado || 0).toLocaleString()}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button
                                                    className="btn btn-config"
                                                    onClick={() => navigate(`/parejas/${idActual}/restricciones`)}
                                                >
                                                    Restricciones
                                                </button>

                                                <button
                                                    className="btn btn-edit"
                                                    onClick={() => navigate(`/parejas/editar/${idActual}`)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() => navigate(`/parejas/eliminar/${idActual}`)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MostrarPareja;