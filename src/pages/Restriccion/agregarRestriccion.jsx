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

function AgregarRestriccion() {
    const { idPareja } = useParams();
    const navigate = useNavigate();

    const [restriccion, setRestriccion] = useState({
        diaSemana: "",
        horaInicio: "",
        horaFin: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestriccion((prev) => ({ ...prev, [name]: value }));
    };

    const guardarRestriccion = (e) => {
        e.preventDefault();

        if (restriccion.horaInicio >= restriccion.horaFin) {
            alert("La hora de inicio debe ser menor a la hora de fin");
            return;
        }

        // TODO backend: reemplazar por una llamada real, por ejemplo:
        //
        // const payload = {
        //     idPareja: Number(idPareja),
        //     diaSemana: restriccion.diaSemana,
        //     horaInicio: restriccion.horaInicio,
        //     horaFin: restriccion.horaFin,
        // };
        // service.crearRestriccion(payload)
        //     .then(() => navigate(`/parejas/${idPareja}/restricciones`))
        //     .catch((err) => {
        //         console.error(err);
        //         alert("No se pudo crear la restricción.");
        //     });
        //
        // Endpoint esperado: POST /Restriccion/CrearRestriccion

        console.log("Restricción creada (quemada):", { idPareja, ...restriccion });
        alert("Restricción registrada correctamente");
        navigate(`/parejas/${idPareja}/restricciones`);
    };

    return (
        <div className="restr-page">
            <div className="restr-shell">
                <div className="restr-header">
                    <div>
                        <h1>Agregar Restricción</h1>
                        <p>Define un nuevo horario permitido para esta pareja</p>
                    </div>
                    <button className="restr-back" onClick={() => navigate(-1)}>
                        ← Volver
                    </button>
                </div>

                <div className="restr-body">
                    <h2 className="card-title" style={{ marginBottom: 18 }}>
                        Información de la Restricción
                    </h2>

                    <form onSubmit={guardarRestriccion}>
                        <div className="form-grid">
                            <div className="field">
                                <label>Día de la Semana</label>
                                <select
                                    name="diaSemana"
                                    value={restriccion.diaSemana}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Seleccione un día
                                    </option>
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
                                Guardar Restricción
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AgregarRestriccion;