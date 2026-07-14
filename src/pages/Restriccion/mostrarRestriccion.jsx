import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./Restriccion.css";

function MostrarRestriccion() {
    const { idPareja } = useParams();
    const navigate = useNavigate();

    const [listaRestricciones, setListaRestricciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const cargarRestricciones = async () => {
            setCargando(true);
            try {
                const respuesta = await service.obtenerRestriccionesPorPareja(idPareja);
                const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.data || []);
                setListaRestricciones(lista);
            } catch (error) {
                console.error("Error al obtener las restricciones", error);
            } finally {
                setCargando(false);
            }
        };
        cargarRestricciones();
    }, [idPareja]);

    const restriccionesFiltradas = listaRestricciones.filter((r) =>
        (r.diaSemana || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="restr-page">
            <div className="restr-shell">
                <div className="restr-header">
                    <div>
                        <h1>Restricciones de Horario</h1>
                        <p>Consulta los horarios permitidos para esta pareja</p>
                    </div>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate(`/parejas/${idPareja}/restricciones/agregar`)}
                    >
                        + Agregar Restricción
                    </button>
                </div>

                <div className="restr-body">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por día..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>Cargando...</p>
                    ) : restriccionesFiltradas.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>No hay restricciones.</p>
                    ) : (
                        <table className="restr-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Día</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {restriccionesFiltradas.map((r) => (
                                <tr key={r.idRestriccion}>
                                    <td>{r.idRestriccion}</td>
                                    <td>{r.diaSemana}</td>
                                    <td>{r.horaInicio}</td>
                                    <td>{r.horaFin}</td>
                                    <td>
                                        <button className="btn btn-delete" onClick={() => {}}>
                                            Eliminar
                                        </button>
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

export default MostrarRestriccion;