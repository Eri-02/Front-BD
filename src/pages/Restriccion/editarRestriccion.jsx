import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Restriccion.css";

const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

/*
    NOTA: no existe todavía el endpoint para traer una restricción por id
    (algo como GET /Restriccion/{id}). Mientras tanto se deja esta lista
    quemada para poder precargar el formulario. Cuando exista el endpoint
    real, reemplazar "buscarRestriccion" por un useEffect con
    service.obtenerRestriccionPorId(idRestriccion), tal como se hace en
    los comentarios de EliminarCliente.jsx.
*/
const restriccionesMock = [
    { idRestriccion: 1, idPareja: 1, diaSemana: "Lunes", horaInicio: "08:00", horaFin: "12:00" },
    { idRestriccion: 2, idPareja: 1, diaSemana: "Miércoles", horaInicio: "14:00", horaFin: "18:00" },
    { idRestriccion: 3, idPareja: 2, diaSemana: "Viernes", horaInicio: "09:00", horaFin: "20:00" },
    { idRestriccion: 4, idPareja: 3, diaSemana: "Sábado", horaInicio: "10:00", horaFin: "22:00" },
];

// TODO backend: borrar esta función junto con restriccionesMock
function buscarRestriccion(idRestriccion) {
    return (
        restriccionesMock.find((r) => r.idRestriccion === Number(idRestriccion)) || null
    );
}

function EditarRestriccion() {
    const { idPareja, idRestriccion } = useParams();
    const navigate = useNavigate();

    const restriccionOriginal = buscarRestriccion(idRestriccion);

    const [restriccion, setRestriccion] = useState(
        restriccionOriginal || { diaSemana: "", horaInicio: "", horaFin: "" }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestriccion((prev) => ({ ...prev, [name]: value }));
    };

    const guardarCambios = (e) => {
        e.preventDefault();

        if (restriccion.horaInicio >= restriccion.horaFin) {
            alert("La hora de inicio debe ser menor a la hora de fin");
            return;
        }

        // TODO backend: reemplazar por una llamada real, por ejemplo:
        //
        // const payload = {
        //     diaSemana: restriccion.diaSemana,
        //     horaInicio: restriccion.horaInicio,
        //     horaFin: restriccion.horaFin,
        // };
        // service.editarRestriccion(idRestriccion, payload)
        //     .then(() => navigate(`/parejas/${idPareja}/restricciones`))
        //     .catch((err) => {
        //         console.error(err);
        //         alert("No se pudieron guardar los cambios.");
        //     });
        //
        // Endpoint esperado: PUT /Restriccion/{id}

        console.log("Restricción editada (quemada):", { idRestriccion, ...restriccion });
        alert("Restricción actualizada correctamente");
        navigate(`/parejas/${idPareja}/restricciones`);
    };

    if (!restriccionOriginal) {
        return (
            <div className="restr-page">
                <div className="restr-shell">
                    <p className="empty-state">Restricción no encontrada</p>
                </div>
            </div>
        );
    }

    return (
        <div className="restr-page">
            <div className="restr-shell">
                <div className="restr-header">
                    <div>
                        <h1>Editar Restricción</h1>
                        <p>Modifica el día u horario permitido para esta pareja</p>
                    </div>
                    <button className="restr-back" onClick={() => navigate(-1)}>
                        ← Volver
                    </button>
                </div>

                <div className="restr-body">
                    <h2 className="card-title" style={{ marginBottom: 18 }}>
                        Información de la Restricción
                    </h2>

                    <form onSubmit={guardarCambios}>
                        <div className="form-grid">
                            <div className="field">
                                <label>Día de la Semana</label>
                                <select
                                    name="diaSemana"
                                    value={restriccion.diaSemana}
                                    onChange={handleChange}
                                    required
                                >
                                    {diasSemana.map((dia) => (
                                        <option key={dia} value={dia}>
                                            {dia}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Hora Inicio</label>
                                <input
                                    type="time"
                                    name="horaInicio"
                                    value={restriccion.horaInicio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Hora Fin</label>
                                <input
                                    type="time"
                                    name="horaFin"
                                    value={restriccion.horaFin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/parejas/${idPareja}/restricciones`)}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditarRestriccion;