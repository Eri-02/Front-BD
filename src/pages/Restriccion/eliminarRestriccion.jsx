import { useParams, useNavigate } from "react-router-dom";
import "./Restriccion.css";

/*
   
        const [restriccion, setRestriccion] = useState(null);
        const [cargando, setCargando] = useState(true);

        useEffect(() => {
            service.obtenerRestriccionPorId(idRestriccion)
                .then((data) => setRestriccion(data))
                .catch((err) => console.error(err))
                .finally(() => setCargando(false));
        }, [idRestriccion]);

       Endpoint esperado: GET /Restriccion/{id}

  
        service.eliminarRestriccion(idRestriccion)
            .then(() => {
                alert("Restricción eliminada correctamente.");
                navigate(`/parejas/${idPareja}/restricciones`);
            })
            .catch((err) => {
                console.error(err);
                alert("No se pudo eliminar la restricción.");
            });


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

function EliminarRestriccion() {
    const { idPareja, idRestriccion } = useParams();
    const navigate = useNavigate();

    const restriccion = buscarRestriccion(idRestriccion);

    const eliminarRestriccion = () => {
        const confirmar = window.confirm(
            "¿Está seguro de eliminar esta restricción?"
        );

        if (confirmar) {
            // TODO backend: reemplazar por service.eliminarRestriccion(idRestriccion)
            alert("Restricción eliminada correctamente.");
            navigate(`/parejas/${idPareja}/restricciones`);
        }
    };

    if (!restriccion) {
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
                        <h1>Eliminar Restricción</h1>
                        <p>Verifique la información antes de eliminar el registro</p>
                    </div>
                    <button className="restr-back" onClick={() => navigate(-1)}>
                        ← Volver
                    </button>
                </div>

                <div className="restr-body">
                    <div className="warning-box">
                        <h3> Advertencia</h3>
                        <p>
                            Esta acción eliminará la restricción de horario para esta
                            pareja. Una vez eliminada no podrá recuperarse.
                        </p>
                    </div>

                    <div className="restr-card">
                        <h2 className="card-title">Información de la Restricción</h2>
                        <p className="card-info">
                            <strong>Día:</strong> {restriccion.diaSemana}
                        </p>
                        <p className="card-info">
                            <strong>Hora Inicio:</strong> {restriccion.horaInicio}
                        </p>
                        <p className="card-info">
                            <strong>Hora Fin:</strong> {restriccion.horaFin}
                        </p>
                    </div>

                    <div className="button-group">
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                        <button className="btn btn-delete" onClick={eliminarRestriccion}>
                            Eliminar Restricción
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EliminarRestriccion;