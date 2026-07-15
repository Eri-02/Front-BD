import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Restriccion.css";
import "../../validation/validacion.css";
import service from "../../service/service.js"
import {
    validarSeleccion,
    validarRequerido,
    validarHoraMenor,
    claseCampo,
    hayErrores,
} from "../../validation/validaciones.js";

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

    const [errores, setErrores] = useState({});
    const [tocados, setTocados] = useState({});

    // ---------- Validación ----------
    const validarCampo = (name, value, restriccionActual = restriccion) => {
        switch (name) {
            case "diaSemana":
                return validarSeleccion(value, "Selecciona un día");
            case "horaInicio":
                return validarRequerido(value, "La hora de inicio") ||
                    validarHoraMenor(value, restriccionActual.horaFin);
            case "horaFin":
                return validarRequerido(value, "La hora de fin") ||
                    validarHoraMenor(restriccionActual.horaInicio, value);
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const actualizado = { ...restriccion, [name]: value };
        setRestriccion(actualizado);

        if (tocados[name]) {
            const nuevosErrores = {
                ...errores,
                [name]: validarCampo(name, value, actualizado),
            };
            // Si cambia una hora, revalida también la otra para mantener el mensaje coherente
            if (name === "horaInicio" && tocados.horaFin) {
                nuevosErrores.horaFin = validarCampo("horaFin", actualizado.horaFin, actualizado);
            }
            if (name === "horaFin" && tocados.horaInicio) {
                nuevosErrores.horaInicio = validarCampo("horaInicio", actualizado.horaInicio, actualizado);
            }
            setErrores(nuevosErrores);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTocados((prev) => ({ ...prev, [name]: true }));
        setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
    };

    const guardarRestriccion = async (e) => {
        e.preventDefault();

        const nuevosErrores = {
            diaSemana: validarCampo("diaSemana", restriccion.diaSemana),
            horaInicio: validarCampo("horaInicio", restriccion.horaInicio),
            horaFin: validarCampo("horaFin", restriccion.horaFin),
        };
        setErrores(nuevosErrores);
        setTocados({ diaSemana: true, horaInicio: true, horaFin: true });

        if (hayErrores(nuevosErrores)) {
            return;
        }

        try {
            const payload = {
                idPareja: Number(idPareja),
                diaSemana: restriccion.diaSemana,
                horaInicio: restriccion.horaInicio,
                horaFin: restriccion.horaFin,
            };

            await service.crearRestriccion(payload);
            alert("Restricción registrada correctamente");
            navigate(`/parejas/${idPareja}/restricciones`);
        } catch (err) {
            console.error(err);
            alert("No se pudo crear la restricción.");
        }
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
                         Volver
                    </button>
                </div>

                <div className="restr-body">
                    <h2 className="card-title" style={{ marginBottom: 18 }}>
                        Información de la Restricción
                    </h2>

                    <form onSubmit={guardarRestriccion} noValidate>
                        <div className="form-grid">
                            <div className="field">
                                <label className="etiqueta-requerida">Día de la Semana</label>
                                <select
                                    name="diaSemana"
                                    className={claseCampo(errores.diaSemana, tocados.diaSemana)}
                                    value={restriccion.diaSemana}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                {tocados.diaSemana && errores.diaSemana && (
                                    <span className="mensaje-error-campo">{errores.diaSemana}</span>
                                )}
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Hora Inicio</label>
                                <input
                                    type="time"
                                    name="horaInicio"
                                    className={claseCampo(errores.horaInicio, tocados.horaInicio)}
                                    value={restriccion.horaInicio}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {tocados.horaInicio && errores.horaInicio && (
                                    <span className="mensaje-error-campo">{errores.horaInicio}</span>
                                )}
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Hora Fin</label>
                                <input
                                    type="time"
                                    name="horaFin"
                                    className={claseCampo(errores.horaFin, tocados.horaFin)}
                                    value={restriccion.horaFin}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {tocados.horaFin && errores.horaFin && (
                                    <span className="mensaje-error-campo">{errores.horaFin}</span>
                                )}
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