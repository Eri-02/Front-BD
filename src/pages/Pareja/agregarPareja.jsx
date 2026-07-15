import { useState, useEffect } from "react";
import authService from "../../service/service";
import "./pareja.css";
import "../../validation/validacion.css";
import {
    validarRequerido,
    validarEmail,
    validarLongitudMinima,
    validarNumeroPositivo,
    validarNumeroMaximo,
    claseCampo,
    hayErrores,
} from "../../validation/validaciones.js";

function AgregarPareja() {
    const [pareja, setPareja] = useState({
        nombreUsuario: "",
        contraseniaUsuario: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        correoElectronico: "",
        cupoAsignado: ""
    });

    const [errores, setErrores] = useState({});
    const [tocados, setTocados] = useState({});

    const [cliente, setCliente] = useState(null);
    const [cupoDisponible, setCupoDisponible] = useState(0);

    useEffect(() => {

        const usuarioLogueado = JSON.parse(localStorage.getItem("userData"));
        const idCliente = usuarioLogueado?.idCliente || usuarioLogueado?.id;

        if (idCliente) {
            authService.obtenerClientePorId(idCliente)
                .then((respuestaBackend) => {
                    const clienteData = respuestaBackend?.cliente || respuestaBackend?.data || respuestaBackend;

                    const datosSincronizados = {
                        ...clienteData,
                        idCliente: clienteData.idCliente || clienteData.id || idCliente
                    };

                    setCliente(datosSincronizados);

                    return authService.obtenerCupoConsumido(idCliente)
                        .then((cupoData) => {
                            const consumido = cupoData?.cupoConsumido || 0;
                            const total = datosSincronizados.cupoTotal || 0;

                            setCupoDisponible(total - consumido);
                        });
                })
                .catch((err) => {
                    console.error("Error al sincronizar los datos ", err);
                });
        }
    }, []);

    // ---------- Validación ----------
    const validarCampo = (name, value) => {
        switch (name) {
            case "nombreUsuario":
                return validarLongitudMinima(value, 4, "El usuario");
            case "contraseniaUsuario":
                return validarLongitudMinima(value, 8, "La contraseña");
            case "primerNombre":
                return validarRequerido(value, "El primer nombre");
            case "primerApellido":
                return validarRequerido(value, "El primer apellido");
            case "correoElectronico":
                return validarEmail(value);
            case "cupoAsignado": {
                const errorPositivo = validarNumeroPositivo(value, "El cupo asignado");
                if (errorPositivo) return errorPositivo;
                return validarNumeroMaximo(value, cupoDisponible, "El cupo asignado");
            }
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPareja({
            ...pareja,
            [name]: value
        });

        if (tocados[name]) {
            setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTocados((prev) => ({ ...prev, [name]: true }));
        setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
    };

    const limpiarFormulario = () => {
        setPareja({
            nombreUsuario: "",
            contraseniaUsuario: "",
            primerNombre: "",
            segundoNombre: "",
            primerApellido: "",
            segundoApellido: "",
            correoElectronico: "",
            cupoAsignado: ""
        });
        setErrores({});
        setTocados({});
    };

    const guardarPareja = async (e) => {
        e.preventDefault();

        if (!cliente || !cliente.idCliente) {
            alert("Error, CLIENTE NO DETECTADO");
            return;
        }

        const camposObligatorios = [
            "nombreUsuario",
            "contraseniaUsuario",
            "primerNombre",
            "primerApellido",
            "correoElectronico",
            "cupoAsignado",
        ];

        const nuevosErrores = {};
        const nuevosTocados = {};
        camposObligatorios.forEach((campo) => {
            nuevosErrores[campo] = validarCampo(campo, pareja[campo]);
            nuevosTocados[campo] = true;
        });

        setErrores(nuevosErrores);
        setTocados((prev) => ({ ...prev, ...nuevosTocados }));

        if (hayErrores(nuevosErrores)) {
            return;
        }

        const cupoAAsignar = parseFloat(pareja.cupoAsignado);

        try {
            const datosCompletos = {
                ...pareja,
                idCliente: cliente.idCliente
            };

            const data = await authService.crearPareja(datosCompletos);

            if (data.status === 201 || data.status === 200) {
                alert("Pareja registrada correctamente");

                setCupoDisponible((prev) => prev - cupoAAsignar);

                limpiarFormulario();
            } else {
                alert("Hubo un problema al registrar la pareja: " + (data.message || "Error"));
            }
        } catch (err) {
            console.error("Error al guardar la pareja:", err);
            alert("Error ");
        }
    };

    return (
        <div className="pareja-page">
            <div className="pareja-container">
                <div className="pareja-header">
                    <h1>Agregar Pareja</h1>
                    <p>Completa la información para registrar una pareja</p>
                    {cliente && (
                        <div className="cupo-info-badge">
                            <strong>Tu Cupo Disponible General:</strong> ${cupoDisponible}
                        </div>
                    )}
                </div>

                <div className="pareja-body">
                    <h2 className="section-title">Información de la Pareja</h2>

                    <form onSubmit={guardarPareja} noValidate>
                        <div className="form-grid">

                            <div className="field">
                                <label className="etiqueta-requerida">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    className={claseCampo(errores.nombreUsuario, tocados.nombreUsuario)}
                                    value={pareja.nombreUsuario}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Ingrese el usuario"
                                />
                                {tocados.nombreUsuario && errores.nombreUsuario && (
                                    <span className="mensaje-error-campo">{errores.nombreUsuario}</span>
                                )}
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Contraseña de Usuario</label>
                                <input
                                    type="password"
                                    name="contraseniaUsuario"
                                    className={claseCampo(errores.contraseniaUsuario, tocados.contraseniaUsuario)}
                                    value={pareja.contraseniaUsuario}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Asigne una contraseña"
                                />
                                {tocados.contraseniaUsuario && errores.contraseniaUsuario && (
                                    <span className="mensaje-error-campo">{errores.contraseniaUsuario}</span>
                                )}
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Primer Nombre</label>
                                <input
                                    type="text"
                                    name="primerNombre"
                                    className={claseCampo(errores.primerNombre, tocados.primerNombre)}
                                    value={pareja.primerNombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Ingrese el primer nombre"
                                />
                                {tocados.primerNombre && errores.primerNombre && (
                                    <span className="mensaje-error-campo">{errores.primerNombre}</span>
                                )}
                            </div>

                            <div className="field">
                                <label>Segundo Nombre</label>
                                <input
                                    type="text"
                                    name="segundoNombre"
                                    value={pareja.segundoNombre}
                                    onChange={handleChange}
                                    placeholder="Ingrese el segundo nombre"
                                />
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Primer Apellido</label>
                                <input
                                    type="text"
                                    name="primerApellido"
                                    className={claseCampo(errores.primerApellido, tocados.primerApellido)}
                                    value={pareja.primerApellido}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Ingrese el primer apellido"
                                />
                                {tocados.primerApellido && errores.primerApellido && (
                                    <span className="mensaje-error-campo">{errores.primerApellido}</span>
                                )}
                            </div>

                            <div className="field">
                                <label>Segundo Apellido</label>
                                <input
                                    type="text"
                                    name="segundoApellido"
                                    value={pareja.segundoApellido}
                                    onChange={handleChange}
                                    placeholder="Ingrese el segundo apellido"
                                />
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correoElectronico"
                                    className={claseCampo(errores.correoElectronico, tocados.correoElectronico)}
                                    value={pareja.correoElectronico}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="ejemplo@correo.com"
                                />
                                {tocados.correoElectronico && errores.correoElectronico && (
                                    <span className="mensaje-error-campo">{errores.correoElectronico}</span>
                                )}
                            </div>

                            <div className="field">
                                <label className="etiqueta-requerida">Cupo Asignado</label>
                                <input
                                    type="number"
                                    name="cupoAsignado"
                                    className={claseCampo(errores.cupoAsignado, tocados.cupoAsignado)}
                                    value={pareja.cupoAsignado}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Máximo $${cupoDisponible}`}
                                />
                                {tocados.cupoAsignado && errores.cupoAsignado && (
                                    <span className="mensaje-error-campo">{errores.cupoAsignado}</span>
                                )}
                            </div>

                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={limpiarFormulario}
                            >
                                Limpiar
                            </button>

                            <button type="submit" className="btn btn-success">
                                Guardar Pareja
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AgregarPareja;