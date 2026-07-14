import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardSupervisor.css";

function DashboardSupervisor() {
    const navigate = useNavigate();
    const [supervisor] = useState(() => {
        const storedUserData = localStorage.getItem("userData");
        return storedUserData ? JSON.parse(storedUserData) : null;
    });

    const [nombreAlmacen, setNombreAlmacen] = useState("");
    const [loadingAlmacen, setLoadingAlmacen] = useState(true);
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (!role || role !== "SUPERVISOR" || !supervisor) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const cargarDatos = async () => {
            try {

                const idAlmacen = supervisor.idAlmacen;
                const almacenes = await service.obtenerAlmacenes();
                const listaAlmacenes = Array.isArray(almacenes) ? almacenes : (almacenes?.data || []);
                const almacen = listaAlmacenes.find((a) => a.idAlmacen === idAlmacen || a.id === idAlmacen);
                setNombreAlmacen(almacen?.nombre || "Almacén no identificado");

                const dataSolicitudes = await service.obtenerSobrecuposSupervisor(supervisor.idSupervisor);
                setSolicitudes(dataSolicitudes || []);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoadingAlmacen(false);
            }
        };

        cargarDatos();
    }, [supervisor, navigate]);

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(Number(valor) || 0);
    };

    const handleEscalar = async (idSobrecupo, escalar) => {
        try {
            await service.escalarSobrecupo(idSobrecupo, escalar);
            alert(escalar ? "Solicitud enviada al cliente para su autorización" : "Solicitud rechazada");

            const data = await service.obtenerSobrecuposSupervisor(supervisor.idSupervisor);
            setSolicitudes(data || []);
        } catch (error) {
            alert("Error al procesar la solicitud: " + (error.message || "Inténtalo de nuevo"));
        }
    };

    const solicitudesPendientes = solicitudes.filter((s) => s.estadoSobrecupo === "PENDIENTE");

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboard-supervisor" className="active">Panel</Link>
                        <Link to="/productos">Productos</Link>
                        <Link to="/supervisor/cliente">Usuarios</Link>
                    </nav>
                </div>

                <div className="hero">
                    <div className="hero-left">
                        <img className="avatar" src="https://cdn-icons-png.flaticon.com/512/7153/7153150.png" alt="Supervisor" />
                        <div>
                            <p className="greet-sub">Hola,</p>
                            <p className="greet-name">{supervisor?.primerNombre} {supervisor?.primerApellido}</p>
                            <p className="greet-role">Supervisor</p>
                        </div>
                    </div>

                    <div className="hero-center">
                        <div className="solicitudes-count">
                            <p className="sol-caption">Solicitudes por atender</p>
                            <p className="sol-amount">{solicitudesPendientes.length}</p>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div>
                            <p className="wallet-caption">Almacén</p>
                            <p className="wallet-amount">{loadingAlmacen ? "Cargando..." : nombreAlmacen}</p>
                        </div>
                    </div>
                </div>

                <div className="main-grid">
                    <div>
                        <div className="col-title">Clientes <span className="minus">—</span></div>
                        <p style={{ color: "#aaa", padding: "10px" }}>Sección en desarrollo</p>
                    </div>

                    <div>
                        <div className="invested-card">
                            <div className="col-title" style={{ marginBottom: 8 }}>
                                Alertas de Sobrecupo <span className="minus">—</span>
                            </div>

                            {solicitudes.length === 0 ? (
                                <p className="empty-note">No hay solicitudes registradas</p>
                            ) : (
                                solicitudes.map((s) => (
                                    <div className={`alert-item ${s.estadoSobrecupo.toLowerCase()}`} key={s.idSobrecupo}>
                                        <div className="alert-info">
                                            <p className="alert-title">
                                                {s.estadoSobrecupo === "APROBADO" ? "Autorizado por Cliente" :
                                                    s.estadoSobrecupo === "ESPERANDO_CLIENTE" ? "En espera del Cliente" :
                                                        "Nueva Solicitud"}
                                            </p>
                                            <p className="alert-desc">
                                                Pareja ID: {s.idPareja} solicitó un sobrecupo de
                                                <span className="alert-amount"> {formatearMoneda(s.montoSobrecupo)}</span>
                                            </p>

                                            {s.estadoSobrecupo === "PENDIENTE" && (
                                                <div className="alert-actions">
                                                    <button onClick={() => handleEscalar(s.idSobrecupo, true)}>Escalar al Cliente</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="col-title">Compras del Almacén <span className="minus">—</span></div>
                        <p style={{ color: "#aaa", padding: "10px" }}>Sin compras recientes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardSupervisor;