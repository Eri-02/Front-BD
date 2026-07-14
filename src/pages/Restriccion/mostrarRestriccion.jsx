import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Restriccion.css";

/*
    NOTA: todavía no existe el endpoint que devuelva las restricciones
    reales de una pareja (algo como GET /Restriccion/ObtenerPorPareja?idPareja=).
    Mientras tanto se deja esta lista quemada, filtrada por idPareja (el
    parámetro que llega por la URL /parejas/:idPareja/restricciones).

    Cuando exista el endpoint real, reemplazar por:

        import { useEffect } from "react";
        const [listaRestricciones, setListaRestricciones] = useState([]);
        const [cargando, setCargando] = useState(true);

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

    y borrar "restriccionesMock" junto con este comentario.
*/
const restriccionesMock = [
    { idRestriccion: 1, idPareja: 1, diaSemana: "Lunes", horaInicio: "08:00", horaFin: "12:00" },
    { idRestriccion: 2, idPareja: 1, diaSemana: "Miércoles", horaInicio: "14:00", horaFin: "18:00" },
    { idRestriccion: 3, idPareja: 2, diaSemana: "Viernes", horaInicio: "09:00", horaFin: "20:00" },
    { idRestriccion: 4, idPareja: 3, diaSemana: "Sábado", horaInicio: "10:00", horaFin: "22:00" },
    { idRestriccion: 5, idPareja: 3, diaSemana: "Domingo", horaInicio: "11:00", horaFin: "21:00" },
    { idRestriccion: 6, idPareja: 4, diaSemana: "Martes", horaInicio: "07:30", horaFin: "13:00" },
];

function MostrarRestriccion() {
    const { idPareja } = useParams();
    const navigate = useNavigate();

    // datos quemados, sin backend — filtrados por la pareja que llega en la URL
    const [listaRestricciones] = useState(
        restriccionesMock.filter((r) => r.idPareja === Number(idPareja))
    );
    const [busqueda, setBusqueda] = useState("");
    const [cargando] = useState(false);

    const restriccionesFiltradas = listaRestricciones.filter((r) =>
        (r.diaSemana || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="restr-page">
            <div className="restr-shell">
                <div className="restr-header">
                    <div>
                        <h1>Restricciones de Horario</h1>
                        <p>Consulta y administra los horarios permitidos para esta pareja</p>
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
                            placeholder="Buscar por día (ej. Lunes)..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>
                            Cargando restricciones...
                        </p>
                    ) : restriccionesFiltradas.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            Esta pareja todavía no tiene restricciones configuradas
                        </p>
                    ) : (
                        <table className="restr-table">
                            <thead>
                                <tr>
                                    <th>ID Restricción</th>
                                    <th>Día</th>
                                    <th>Hora Inicio</th>
                                    <th>Hora Fin</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restriccionesFiltradas.map((r) => (
                                    <tr key={r.idRestriccion}>
                                        <td>{r.idRestriccion}</td>
                                        <td>
                                            <span className="dia-badge">{r.diaSemana}</span>
                                        </td>
                                        <td>{r.horaInicio}</td>
                                        <td>{r.horaFin}</td>
                                        <td>
                                            <div className="acciones-cell">
                                                <button
                                                    className="btn btn-edit"
                                                    onClick={() =>
                                                        navigate(
                                                            `/parejas/${idPareja}/restricciones/editar/${r.idRestriccion}`
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() =>
                                                        navigate(
                                                            `/parejas/${idPareja}/restricciones/eliminar/${r.idRestriccion}`
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
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