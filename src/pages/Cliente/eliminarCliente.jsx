import { useParams, useNavigate } from "react-router-dom";
import "./cliente.css";

/*
    
        const [cliente, setCliente] = useState(null);
        const [cargando, setCargando] = useState(true);

        useEffect(() => {
            setCargando(true);
            service.obtenerClientePorId(id)
                .then((data) => setCliente(data))
                .catch((err) => console.error(err))
                .finally(() => setCargando(false));
        }, [id]);

       GET /Cliente/{id}

        service.eliminarCliente(id)
            .then(() => {
                alert("Cliente eliminado correctamente.");
                navigate("/supervisor/cliente");
            })
            .catch((err) => {
                console.error(err);
                alert("No se pudo eliminar el cliente.");
            });
*/
const listaClientesMock = [
    { idCliente: 1, nombreUsuario: "dianaperez", primerNombre: "Diana", segundoNombre: "Maria", primerApellido: "Pérez", segundoApellido: "Gómez", correoElectronico: "diana.perez@correo.com", cupoTotal: 5000000 },
    { idCliente: 2, nombreUsuario: "luisramirez", primerNombre: "Luis", segundoNombre: "", primerApellido: "Ramírez", segundoApellido: "Ortiz", correoElectronico: "luis.ramirez@correo.com", cupoTotal: 3500000 },
    { idCliente: 3, nombreUsuario: "mateorojas", primerNombre: "Mateo", segundoNombre: "", primerApellido: "Rojas", segundoApellido: "Cruz", correoElectronico: "mateo.rojas@correo.com", cupoTotal: 2000000 },
    { idCliente: 4, nombreUsuario: "camilavega", primerNombre: "Camila", segundoNombre: "Andrea", primerApellido: "Vega", segundoApellido: "Salazar", correoElectronico: "camila.vega@correo.com", cupoTotal: 8000000 },
    { idCliente: 5, nombreUsuario: "andresmora", primerNombre: "Andrés", segundoNombre: "", primerApellido: "Mora", segundoApellido: "Londoño", correoElectronico: "andres.mora@correo.com", cupoTotal: 4500000 },
    { idCliente: 6, nombreUsuario: "valentinagz", primerNombre: "Valentina", segundoNombre: "", primerApellido: "Gutiérrez", segundoApellido: "Ríos", correoElectronico: "valentina.gutierrez@correo.com", cupoTotal: 6000000 },
];

// borrar esta función junto con listaClientesMock
function buscarCliente(id) {
    return listaClientesMock.find((c) => c.idCliente === Number(id)) || null;
}

function EliminarCliente() {
    const { id } = useParams();
    const navigate = useNavigate();

    // No hace falta useState/useEffect aquí: como el mock es
    // síncrono, basta con calcular el valor en cada render.
    const cliente = buscarCliente(id);

    const eliminarCliente = () => {
        const confirmar = window.confirm(
            "¿Está seguro de eliminar este cliente?"
        );

        if (confirmar) {
            // reemplazar por service.eliminarCliente(id)
            alert("Cliente eliminado correctamente.");
            navigate("/supervisor/cliente");
        }
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
                    <h1>Eliminar Cliente</h1>
                    <p>Verifique la información antes de eliminar el registro.</p>
                </div>

                <div className="cliente-body">

                    <div className="warning-box">
                        <h3> Advertencia</h3>
                        <p>
                            Esta acción eliminará al cliente del sistema, junto con sus
                            parejas asociadas. Una vez eliminado no podrá recuperarse.
                        </p>
                    </div>

                    <div className="cliente-card">
                        <div className="card-header">
                            <h2 className="card-title">Información del Cliente</h2>
                        </div>

                        <p className="card-info"><strong>ID:</strong> {cliente.idCliente}</p>
                        <p className="card-info"><strong>Usuario:</strong> {cliente.nombreUsuario}</p>
                        <p className="card-info"><strong>Primer Nombre:</strong> {cliente.primerNombre}</p>
                        <p className="card-info"><strong>Segundo Nombre:</strong> {cliente.segundoNombre || "-"}</p>
                        <p className="card-info"><strong>Primer Apellido:</strong> {cliente.primerApellido}</p>
                        <p className="card-info"><strong>Segundo Apellido:</strong> {cliente.segundoApellido || "-"}</p>
                        <p className="card-info"><strong>Correo Electrónico:</strong> {cliente.correoElectronico}</p>
                        <p className="card-info">
                            <strong>Cupo Total:</strong> ${cliente.cupoTotal.toLocaleString("es-CO")}
                        </p>
                    </div>

                    <div className="button-group">
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Cancelar
                        </button>

                        <button className="btn btn-delete" onClick={eliminarCliente}>
                            Eliminar Cliente
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default EliminarCliente;