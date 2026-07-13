import { useState } from "react";
import "./cliente.css";

function AgregarCliente() {
    const [cliente, setCliente] = useState({
        nombreUsuario: "",
        contraseniaUsuario: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        correoElectronico: "",
        cupoTotal: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value
        });
    };

    const guardarCliente = (e) => {
        e.preventDefault();

        // Aquí irá el POST al backend

        console.log("Cliente registrado:", cliente);

        alert("Cliente registrado correctamente");

        setCliente({
            nombreUsuario: "",
            contraseniaUsuario: "",
            primerNombre: "",
            segundoNombre: "",
            primerApellido: "",
            segundoApellido: "",
            correoElectronico: "",
            cupoTotal: ""
        });
    };

    return (
        <div className="cliente-page">
            <div className="cliente-container">
                <div className="cliente-header">
                    <h1>Agregar Cliente</h1>
                    <p>Completa la información para registrar un cliente en tu almacén</p>
                </div>

                <div className="cliente-body">
                    <h2 className="section-title">Información del Cliente</h2>

                    <form onSubmit={guardarCliente}>
                        <div className="form-grid">

                            <div className="field">
                                <label>Nombre de Usuario</label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    value={cliente.nombreUsuario}
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
                                    value={cliente.contraseniaUsuario}
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
                                    value={cliente.primerNombre}
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
                                    value={cliente.segundoNombre}
                                    onChange={handleChange}
                                    placeholder="Ingrese el segundo nombre"
                                />
                            </div>

                            <div className="field">
                                <label>Primer Apellido</label>
                                <input
                                    type="text"
                                    name="primerApellido"
                                    value={cliente.primerApellido}
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
                                    value={cliente.segundoApellido}
                                    onChange={handleChange}
                                    placeholder="Ingrese el segundo apellido"
                                />
                            </div>

                            <div className="field">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correoElectronico"
                                    value={cliente.correoElectronico}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Cupo Total</label>
                                <input
                                    type="number"
                                    name="cupoTotal"
                                    value={cliente.cupoTotal}
                                    onChange={handleChange}
                                    placeholder="Ej: 500000"
                                    required
                                />
                            </div>

                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setCliente({
                                        nombreUsuario: "",
                                        contraseniaUsuario: "",
                                        primerNombre: "",
                                        segundoNombre: "",
                                        primerApellido: "",
                                        segundoApellido: "",
                                        correoElectronico: "",
                                        cupoTotal: ""
                                    })
                                }
                            >
                                Limpiar
                            </button>

                            <button type="submit" className="btn btn-success">
                                Guardar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AgregarCliente;