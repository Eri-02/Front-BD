import { useState, useEffect } from "react";
import authService from "../../service/service";
import "./pareja.css";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPareja({
            ...pareja,
            [name]: value
        });
    };

    const guardarPareja = async (e) => {
        e.preventDefault();

        if (!cliente || !cliente.idCliente) {
            alert("Error, CLIENTE NO DETECTADO");
            return;
        }

        const cupoAAsignar = parseFloat(pareja.cupoAsignado);

        // Validación estricta de la regla de negocio
        if (cupoAAsignar > cupoDisponible) {
            alert(`No puedes asignar este monto, supera cupo disponible restante es de $${cupoDisponible}`);
            return;
        }

        try {
            const datosCompletos = {
                ...pareja,
                idCliente: cliente.idCliente
            };

            const data = await authService.crearPareja(datosCompletos);

            if (data.status === 201 || data.status === 200) {
                alert("Pareja registrada correctamente");

                setCupoDisponible((prev) => prev - cupoAAsignar);

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

                    <form onSubmit={guardarPareja}>
                        <div className="form-grid">

                            <div className="field">
                                <label>Nombre de Usuario</label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    value={pareja.nombreUsuario}
                                    onChange={handleChange}
                                    placeholder="Ingrese el usuario"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Contraseña de Usuario</label>
                                <input
                                    type="password"
                                    name="contraseniaUsuario"
                                    value={pareja.contraseniaUsuario}
                                    onChange={handleChange}
                                    placeholder="Asigne una contraseña"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Primer Nombre</label>
                                <input
                                    type="text"
                                    name="primerNombre"
                                    value={pareja.primerNombre}
                                    onChange={handleChange}
                                    placeholder="Ingrese el primer nombre"
                                    required
                                />
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
                                <label>Primer Apellido</label>
                                <input
                                    type="text"
                                    name="primerApellido"
                                    value={pareja.primerApellido}
                                    onChange={handleChange}
                                    placeholder="Ingrese el primer apellido"
                                    required
                                />
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
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correoElectronico"
                                    value={pareja.correoElectronico}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Cupo Asignado</label>
                                <input
                                    type="number"
                                    name="cupoAsignado"
                                    value={pareja.cupoAsignado}
                                    onChange={handleChange}
                                    placeholder={`Máximo $${cupoDisponible}`}
                                    required
                                />
                            </div>

                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setPareja({
                                        nombreUsuario: "",
                                        contraseniaUsuario: "",
                                        primerNombre: "",
                                        segundoNombre: "",
                                        primerApellido: "",
                                        segundoApellido: "",
                                        correoElectronico: "",
                                        cupoAsignado: ""
                                    })
                                }
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