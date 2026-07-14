import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cliente.css";


const listaClientesMock = [
    {
        idCliente: 1,
        nombreUsuario: "dianaperez",
        primerNombre: "Diana",
        segundoNombre: "Maria",
        primerApellido: "Pérez",
        segundoApellido: "Gómez",
        correoElectronico: "diana.perez@correo.com",
        cupoTotal: 5000000,
        cupoUsado: 3200000,
    },
    {
        idCliente: 2,
        nombreUsuario: "luisramirez",
        primerNombre: "Luis",
        segundoNombre: "",
        primerApellido: "Ramírez",
        segundoApellido: "Ortiz",
        correoElectronico: "luis.ramirez@correo.com",
        cupoTotal: 3500000,
        cupoUsado: 900000,
    },
    {
        idCliente: 3,
        nombreUsuario: "mateorojas",
        primerNombre: "Mateo",
        segundoNombre: "",
        primerApellido: "Rojas",
        segundoApellido: "Cruz",
        correoElectronico: "mateo.rojas@correo.com",
        cupoTotal: 2000000,
        cupoUsado: 1850000,
    },
    {
        idCliente: 4,
        nombreUsuario: "camilavega",
        primerNombre: "Camila",
        segundoNombre: "Andrea",
        primerApellido: "Vega",
        segundoApellido: "Salazar",
        correoElectronico: "camila.vega@correo.com",
        cupoTotal: 8000000,
        cupoUsado: 4100000,
    },
    {
        idCliente: 5,
        nombreUsuario: "andresmora",
        primerNombre: "Andrés",
        segundoNombre: "",
        primerApellido: "Mora",
        segundoApellido: "Londoño",
        correoElectronico: "andres.mora@correo.com",
        cupoTotal: 4500000,
        cupoUsado: 4500000,
    },
    {
        idCliente: 6,
        nombreUsuario: "valentinagz",
        primerNombre: "Valentina",
        segundoNombre: "",
        primerApellido: "Gutiérrez",
        segundoApellido: "Ríos",
        correoElectronico: "valentina.gutierrez@correo.com",
        cupoTotal: 6000000,
        cupoUsado: 0,
    },
];

function MostrarCliente() {
    const navigate = useNavigate();

    const [listaClientes] = useState(listaClientesMock);
    const [busqueda, setBusqueda] = useState("");
    const [cargando] = useState(false);

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const clientesFiltrados = listaClientes.filter((cliente) => {
        if (!cliente) return false;
        const termino = busqueda.toLowerCase();

        const primerNombre = (cliente.primerNombre || "").toLowerCase();
        const primerApellido = (cliente.primerApellido || "").toLowerCase();
        const nombreUsuario = (cliente.nombreUsuario || "").toLowerCase();
        const correo = (cliente.correoElectronico || "").toLowerCase();

        return (
            primerNombre.includes(termino) ||
            primerApellido.includes(termino) ||
            nombreUsuario.includes(termino) ||
            correo.includes(termino)
        );
    });

    return (
        <div className="cliente-page">
            <div className="cliente-container">
                <div className="cliente-header">
                    <h1>Gestión de Clientes</h1>
                    <p>Consulta todos los clientes registrados en tu almacén</p>
                </div>

                <div className="cliente-body">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, usuario o correo..."
                            value={busqueda}
                            onChange={handleBusquedaChange}
                        />
                    </div>

                    {cargando ? (
                        <p style={{ textAlign: "center", padding: "20px" }}>Cargando clientes...</p>
                    ) : clientesFiltrados.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            No se encontraron clientes registrados para este almacén
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
                                    <th>Cupo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {clientesFiltrados.map((cliente) => {
                                    const idActual = cliente.idCliente;
                                    const porcentaje =
                                        cliente.cupoTotal > 0
                                            ? Math.min((cliente.cupoUsado / cliente.cupoTotal) * 100, 100)
                                            : 0;

                                    return (
                                        <tr key={idActual}>
                                            <td>{idActual}</td>
                                            <td>{cliente.nombreUsuario}</td>
                                            <td>{cliente.primerNombre}</td>
                                            <td>{cliente.segundoNombre || "-"}</td>
                                            <td>{cliente.primerApellido}</td>
                                            <td>{cliente.segundoApellido || "-"}</td>
                                            <td>{cliente.correoElectronico}</td>
                                            <td>
                                                <div className="cupo-cell">
                                                    <span className="cupo-text">
                                                        ${cliente.cupoUsado.toLocaleString("es-CO")} / $
                                                        {cliente.cupoTotal.toLocaleString("es-CO")}
                                                    </span>
                                                    <div className="cupo-track">
                                                        <div
                                                            className="cupo-fill"
                                                            style={{ width: `${porcentaje}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="acciones-cell">
                                                    <button
                                                        className="btn btn-parejas"
                                                        onClick={() =>
                                                            navigate(`/supervisor/cliente/${idActual}/parejas`)
                                                        }
                                                    >
                                                        Parejas
                                                    </button>
                                                    <button
                                                        className="btn btn-edit"
                                                        onClick={() =>
                                                            navigate(`/supervisor/cliente/editar/${idActual}`)
                                                        }
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-delete"
                                                        onClick={() =>
                                                            navigate(`/supervisor/cliente/eliminar/${idActual}`)
                                                        }
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

export default MostrarCliente;