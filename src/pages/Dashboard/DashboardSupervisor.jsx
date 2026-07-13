import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardSupervisor.css";

//reemplazar
const mockClientes = [
    { idCliente: 1, nombre: "Camila Rojas", cupoTotal: 15000000, cupoUsado: 8200000 },
    { idCliente: 2, nombre: "Andrés Pérez", cupoTotal: 9000000, cupoUsado: 3100000 },
    { idCliente: 3, nombre: "Valentina Gómez", cupoTotal: 20000000, cupoUsado: 17800000 },
];

//reemplazar
const mockSolicitudes = [
    { id: 1, clienteNombre: "Camila Rojas", parejaNombre: "Luis Rojas", monto: 5000000, estado: "pendiente" },
    { id: 2, clienteNombre: "Andrés Pérez", parejaNombre: "Diego Pérez", monto: 3000000, estado: "pendiente" },
    { id: 3, clienteNombre: "Valentina Gómez", parejaNombre: "Mateo Gómez", monto: 2000000, estado: "aprobado" },
];

//reemplazar
const mockCompras = [
    { id: 1, date: "2026-07-10", time: "14:30", pareja: "Luis Rojas", amount: "$1.5M" },
    { id: 2, date: "2026-07-09", time: "11:05", pareja: "Diego Pérez", amount: "$820k" },
    { id: 3, date: "2026-07-08", time: "17:42", pareja: "Mateo Gómez", amount: "$2.1M" },
];

function DashboardSupervisor() {
    const navigate = useNavigate();

    const [supervisor] = useState(() => {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            try {
                return JSON.parse(storedUserData);
            } catch (e) {
                console.error("Error al parsear userData inicial:", e);
                return null;
            }
        }
        return null;
    });

    const [nombreAlmacen, setNombreAlmacen] = useState("");
    const [loadingAlmacen, setLoadingAlmacen] = useState(true);

    const [solicitudes, setSolicitudes] = useState(mockSolicitudes);
    const [clientes] = useState(mockClientes);
    const [compras] = useState(mockCompras);

    const [modalCliente, setModalCliente] = useState(null);
    const [parejas, setParejas] = useState([]);
    const [loadingParejas, setLoadingParejas] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userRole");

        if (!role || role !== "SUPERVISOR" || !supervisor) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const cargarAlmacen = async () => {
            try {
                const idAlmacen = supervisor.idAlmacen;
                const almacenes = await service.obtenerAlmacenes();
                const listaAlmacenes = Array.isArray(almacenes) ? almacenes : (almacenes?.data || []);
                const almacen = listaAlmacenes.find(
                    (a) => a.idAlmacen === idAlmacen || a.id === idAlmacen
                );
                setNombreAlmacen(almacen?.nombre || "Almacén no identificado");
            } catch (error) {
                console.error("Error al cargar el almacén:", error);
                setNombreAlmacen("Almacén no disponible");
            } finally {
                setLoadingAlmacen(false);
            }
        };

        cargarAlmacen();
    }, [supervisor, navigate]);

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(numero);
    };

    const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente");

    //reemplazar
    const handleAprobar = (id) => {
        setSolicitudes((prev) =>
            prev.map((s) => (s.id === id ? { ...s, estado: "aprobado" } : s))
        );
    };

    const handleRechazar = (id) => {
        setSolicitudes((prev) =>
            prev.map((s) => (s.id === id ? { ...s, estado: "rechazado" } : s))
        );
    };

    const abrirParejas = async (cliente) => {
        setModalCliente(cliente);
        setLoadingParejas(true);
        try {
            const dataParejas = await service.obtenerParejasPorCliente(cliente.idCliente);
            const lista = Array.isArray(dataParejas) ? dataParejas : (dataParejas?.data || []);
            setParejas(
                lista.map((p) => ({
                    id: p.idPareja,
                    nombre: `${p.primerNombre} ${p.primerApellido}`,
                    cupoAsignado: Number(p.cupoAsignado) || 0,
                }))
            );
        } catch (error) {
            console.error("Error al cargar las parejas del cliente:", error);
            setParejas([]);
        } finally {
            setLoadingParejas(false);
        }
    };

    const cerrarModal = () => {
        setModalCliente(null);
        setParejas([]);
    };

    if (!supervisor) {
        return <div style={{ color: "#fff", padding: "20px" }}>Verificando credenciales...</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboard-supervisor" className="active">
                            Panel
                        </Link>
                        <Link to="/productos">Productos</Link>
                        <Link to="/supervisor/cliente">Usuarios</Link>
                    </nav>
                </div>

                <div className="hero">
                    <div className="hero-left">
                        <img
                            className="avatar"
                            src="https://cdn-icons-png.flaticon.com/512/7153/7153150.png"
                            alt={`${supervisor.primerNombre || ""} ${supervisor.primerApellido || ""}`}
                        />
                        <div>
                            <p className="greet-sub">Hola,</p>
                            <p className="greet-name">
                                {supervisor.primerNombre} {supervisor.primerApellido}
                            </p>
                            <p className="greet-role">Supervisor</p>
                        </div>
                    </div>

                    <div className="hero-center">
                        <div className="solicitudes-count">
                            <div className="bell-icon">🔔</div>
                            <p className="sol-caption">Solicitudes por atender</p>
                            <p className="sol-amount">{solicitudesPendientes.length}</p>
                        </div>
                        <div className="sol-sub">
                            <p className="sol-detail">Sobrecupos pendientes de revisión</p>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="wallet-row">
                            <div className="wallet-icon">🏬</div>
                            <div>
                                <p className="wallet-caption">Almacén</p>
                                <p className="wallet-amount">
                                    {loadingAlmacen ? "Cargando..." : nombreAlmacen}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-grid">
                    <div>
                        <div className="col-title">
                            Clientes <span className="minus">—</span>
                        </div>

                        {clientes.length === 0 ? (
                            <p style={{ color: "#aaa", padding: "10px" }}>No hay clientes asociados</p>
                        ) : (
                            clientes.map((c) => {
                                const progreso =
                                    c.cupoTotal > 0
                                        ? Math.min((c.cupoUsado / c.cupoTotal) * 100, 100)
                                        : 0;
                                return (
                                    <div className="partner-card" key={c.idCliente}>
                                        <div className="partner-head">
                                            <p className="partner-name">{c.nombre}</p>
                                        </div>
                                        <p className="partner-meta">
                                            Cupo total: {formatearMoneda(c.cupoTotal)}
                                        </p>
                                        <p className="partner-meta">
                                            Cupo usado: {formatearMoneda(c.cupoUsado)}
                                        </p>
                                        <div className="progress-track">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progreso}%` }}
                                            />
                                        </div>
                                        <button
                                            className="btn-ver-parejas"
                                            onClick={() => abrirParejas(c)}
                                        >
                                            Ver Parejas
                                        </button>
                                    </div>
                                );
                            })
                        )}
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
                                    <div className="alert-item" key={s.id}>
                                        <div className="alert-left">
                                            <div className="alert-avatars">
                                                <img src="/imagen.png" alt={s.parejaNombre} />
                                            </div>
                                            <div>
                                                <p className="alert-name">{s.parejaNombre}</p>
                                                <p className="alert-meta">Cliente: {s.clienteNombre}</p>
                                                <p className="alert-amount">
                                                    {formatearMoneda(s.monto)}
                                                </p>
                                            </div>
                                        </div>

                                        {s.estado === "pendiente" ? (
                                            <div className="alert-actions">
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleAprobar(s.id)}
                                                >
                                                    Aprobar
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleRechazar(s.id)}
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`badge ${s.estado}`}>
                                                {s.estado === "aprobado" ? "Aprobado" : "Rechazado"}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="col-title">
                            Compras del Almacén <span className="minus">—</span>
                        </div>

                        <div className="mini-card">
                            <div className="mini-title">Compras Recientes</div>
                            <table className="tx-table">
                                <thead>
                                    <tr>
                                        <th>Fecha/Hora</th>
                                        <th>Pareja</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compras.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>
                                                {tx.date}
                                                <br />
                                                {tx.time}
                                            </td>
                                            <td>{tx.pareja}</td>
                                            <td className="pos">{tx.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {modalCliente && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <p className="modal-title">Parejas de {modalCliente.nombre}</p>
                            <button className="modal-close" onClick={cerrarModal}>
                                ✕
                            </button>
                        </div>

                        <p className="modal-section-title">Parejas activas</p>
                        {loadingParejas ? (
                            <p style={{ color: "#aaa" }}>Cargando...</p>
                        ) : parejas.length === 0 ? (
                            <p style={{ color: "#aaa" }}>Este cliente no tiene parejas registradas</p>
                        ) : (
                            parejas.map((p) => (
                                <div className="pareja-item" key={p.id}>
                                    <p className="pareja-name">{p.nombre}</p>
                                    <p className="pareja-meta">
                                        {formatearMoneda(p.cupoAsignado)}
                                    </p>
                                </div>
                            ))
                        )}

                        {/* TODO backend: reemplazar por historial real de compras de la pareja */}
                        <p className="modal-section-title">Historial de compras</p>
                        {mockCompras
                            .filter((c) =>
                                parejas.some((p) => p.nombre === c.pareja)
                            )
                            .map((c) => (
                                <div className="hist-item" key={c.id}>
                                    <span className="hist-store">{c.pareja}</span>
                                    <span className="hist-date">
                                        {c.date} · {c.amount}
                                    </span>
                                </div>
                            ))}
                        {parejas.length === 0 && (
                            <p style={{ color: "#aaa", fontSize: "12px" }}>
                                Sin historial disponible
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardSupervisor;