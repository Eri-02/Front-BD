import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./cliente.css";

/*
    ============================================================
    CONEXIÓN CON BACKEND (pendiente)
    ============================================================
    Este componente usa datos quemados (listaClientesMock) mientras
    no exista el endpoint. Cuando el backend esté listo:

    1) Eliminar "listaClientesMock" y "buscarCliente".

    2) Reemplazar la carga inicial. Como una llamada real es
       asíncrona, ahí SÍ corresponde usar useEffect (a diferencia
       del mock síncrono actual):

        const [cliente, setCliente] = useState(null);
        const [cargando, setCargando] = useState(true);

        useEffect(() => {
            setCargando(true);
            service.obtenerClientePorId(id)
                .then((data) => setCliente(data))
                .catch((err) => console.error(err))
                .finally(() => setCargando(false));
        }, [id]);

       Endpoint esperado: GET /Cliente/{id}

    3) Reemplazar el "console.log" dentro de actualizarCliente por:

        service.actualizarCliente(id, cliente)
            .then(() => {
                alert("Los datos del cliente fueron actualizados.");
                navigate("/supervisor/cliente");
            })
            .catch((err) => {
                console.error(err);
                alert("No se pudo actualizar el cliente.");
            });

       Endpoint esperado: PUT o PATCH /Cliente/{id}
    ============================================================
*/
const listaClientesMock = [
    { idCliente: 1, nombreUsuario: "dianaperez", primerNombre: "Diana", segundoNombre: "Maria", primerApellido: "Pérez", segundoApellido: "Gómez", correoElectronico: "diana.perez@correo.com", cupoTotal: 5000000 },
    { idCliente: 2, nombreUsuario: "luisramirez", primerNombre: "Luis", segundoNombre: "", primerApellido: "Ramírez", segundoApellido: "Ortiz", correoElectronico: "luis.ramirez@correo.com", cupoTotal: 3500000 },
    { idCliente: 3, nombreUsuario: "mateorojas", primerNombre: "Mateo", segundoNombre: "", primerApellido: "Rojas", segundoApellido: "Cruz", correoElectronico: "mateo.rojas@correo.com", cupoTotal: 2000000 },
    { idCliente: 4, nombreUsuario: "camilavega", primerNombre: "Camila", segundoNombre: "Andrea", primerApellido: "Vega", segundoApellido: "Salazar", correoElectronico: "camila.vega@correo.com", cupoTotal: 8000000 },
    { idCliente: 5, nombreUsuario: "andresmora", primerNombre: "Andrés", segundoNombre: "", primerApellido: "Mora", segundoApellido: "Londoño", correoElectronico: "andres.mora@correo.com", cupoTotal: 4500000 },
    { idCliente: 6, nombreUsuario: "valentinagz", primerNombre: "Valentina", segundoNombre: "", primerApellido: "Gutiérrez", segundoApellido: "Ríos", correoElectronico: "valentina.gutierrez@correo.com", cupoTotal: 6000000 },
];

// TODO backend: borrar esta función junto con listaClientesMock
function buscarCliente(id) {
    return listaClientesMock.find((c) => c.idCliente === Number(id)) || null;
}

function EditarCliente() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Guardamos el id junto con el cliente para poder detectar,
    // durante el render, cuando el :id de la URL cambia (por ejemplo
    // si se navega de "editar/1" a "editar/2" sin desmontar el
    // componente) y así recalcular sin usar useEffect.
    const [prevId, setPrevId] = useState(id);
    const [cliente, setCliente] = useState(() => buscarCliente(id));

    if (id !== prevId) {
        setPrevId(id);
        setCliente(buscarCliente(id));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value,
        });
    };

    const actualizarCliente = (e) => {
        e.preventDefault();

        // TODO backend: reemplazar por service.actualizarCliente(id, cliente)
        console.log("Cliente actualizado:", cliente);
        alert("Los datos del cliente fueron actualizados.");
        navigate("/supervisor/cliente");
    };

    if (!cliente) {
        return (
            <div className="cliente-page">
                <div className="cliente-container">
                    <p style={{ textAlign: "center", padding: "20px" }}>
                        Cliente no encontrado
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="cliente-page">
            <div className="cliente-container">

                <div className="cliente-header">
                    <h1>Editar Cliente</h1>
                    <p>Modifique la información del cliente registrado.</p>
                </div>

                <div className="cliente-body">
                    <h2 className="section-title">Actualizar Información</h2>

                    <form onSubmit={actualizarCliente}>
                        <div className="form-grid">

                            <div className="field">
                                <label>ID</label>
                                <input type="text" value={cliente.idCliente} disabled />
                            </div>

                            <div className="field">
                                <label>Nombre de Usuario</label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    value={cliente.nombreUsuario}
                                    onChange={handleChange}
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
                                />
                            </div>

                            <div className="field">
                                <label>Primer Apellido</label>
                                <input
                                    type="text"
                                    name="primerApellido"
                                    value={cliente.primerApellido}
                                    onChange={handleChange}
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
                                />
                            </div>

                            <div className="field">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correoElectronico"
                                    value={cliente.correoElectronico}
                                    onChange={handleChange}
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
                                    required
                                />
                            </div>

                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Cancelar
                            </button>

                            <button type="submit" className="btn btn-edit">
                                Guardar Cambios
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default EditarCliente;