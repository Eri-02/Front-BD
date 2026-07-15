import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardCliente.css";

function Dashboard() {
    const navigate = useNavigate();

    const [cliente] = useState(() => {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            try {
                return JSON.parse(storedUserData);
            } catch (e) {
                console.error("Error:", e);
                return null;
            }
        }
        return null;
    });

    const [cupoDisponible, setCupoDisponible] = useState(0);
    const [cupoConsumidoGeneral, setCupoConsumidoGeneral] = useState(0);
    const [cupoTotalReal, setCupoTotalReal] = useState(0);

    const [partners, setPartners] = useState([]);
    const [overlimits, setOverlimits] = useState([]);
    const [loadingPartners, setLoadingPartners] = useState(true);

    const statusLabel = {
        pendiente: "Pendiente",
        aprobado: "Aprobado",
        rechazado: "Rechazado",
        esperando_cliente: "Requiere Autorización"
    };

    // Declarada arriba de todo para poder usarla dentro del useEffect
    // y en cualquier otro handler sin problemas de orden.
    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }).format(numero);
    };

    useEffect(() => {
        const role = localStorage.getItem("userRole");

        if (!role || role !== "CLIENTE" || !cliente) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const cargarDatosFinancierosYParejas = async () => {
            try {
                const idCliente = cliente.idCliente || cliente.id;

                if (!idCliente) return;

                const respuestaCliente = await service.obtenerClientePorId(idCliente);
                const clienteData = respuestaCliente?.cliente || respuestaCliente?.data || respuestaCliente;
                setCupoTotalReal(Number(clienteData?.cupoTotal) || 0);

                const respuestaCupo = await service.obtenerCupoConsumido(idCliente);
                const consumido = Number(respuestaCupo?.cupoConsumido) || 0;
                setCupoConsumidoGeneral(consumido);
                setCupoDisponible((Number(clienteData?.cupoTotal) || 0) - consumido);

                const dataParejas = await service.obtenerParejasPorCliente(idCliente);
                if (Array.isArray(dataParejas)) {
                    setPartners(dataParejas.map(p => {
                        const asignado = Number(p.cupoAsignado) || 0;
                        const consumidoPareja = Number(p.cupoConsumido) || 0;
                        const progreso = asignado > 0 ? Math.round((consumidoPareja / asignado) * 100) : 0;

                        return {
                            id: p.idPareja,
                            name: `${p.primerNombre} ${p.primerApellido}`,
                            avatars: ["/img/imagen.png"],
                            assignedRaw: asignado,
                            assigned: formatearMoneda(asignado),
                            used: formatearMoneda(consumidoPareja),
                            progress: progreso
                        };
                    }));
                }

                try {
                    const dataSobrecupos = await service.obtenerSobrecuposPorCliente(idCliente);
                    if (Array.isArray(dataSobrecupos)) {
                        setOverlimits(dataSobrecupos.map(s => {
                            return {
                                id: s.idSobrecupo,
                                name: `Pareja ID: ${s.idPareja}`,
                                amount: formatearMoneda(s.montoSobrecupo),
                                status: s.estadoSobrecupo ? s.estadoSobrecupo.toLowerCase() : "pendiente",
                                avatars: ["/img/imagen.png"]
                            };
                        }));
                    }
                } catch (e) {
                    console.warn("error:", e);
                }

            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoadingPartners(false);
            }
        };

        cargarDatosFinancierosYParejas();



    }, [cliente, navigate]);

    const handleResponderSobrecupo = async (idSobrecupo, aprobado) => {
        try {
            await service.responderSobrecupo(idSobrecupo, aprobado);

            const idCliente = cliente.idCliente || cliente.id;
            const data = await service.obtenerSobrecuposPorCliente(idCliente);

            setOverlimits(Array.isArray(data) ? data.map(s => ({
                id: s.idSobrecupo,
                name: `Pareja ID: ${s.idPareja}`,
                amount: formatearMoneda(s.montoSobrecupo),
                status: s.estadoSobrecupo.toLowerCase(),
                avatars: ["/img/imagen.png"]
            })) : []);

            alert(aprobado ? "Solicitud autorizada correctamente" : "Solicitud rechazada");
        } catch (error) {
            console.error("Error al responder:", error);
            alert("Hubo un problema al procesar la respuesta.");
        }
    };

    if (!cliente) {
        return <div style={{ color: "#fff", padding: "20px" }}>Verificando credenciales...</div>;
    }

    const porcentajeUsado = cupoTotalReal > 0 ? Math.round((cupoConsumidoGeneral / cupoTotalReal) * 100) : 0;

    const circunferenciaAnillo = 515.2;
    const offsetAnillo = circunferenciaAnillo - (porcentajeUsado / 100) * circunferenciaAnillo;

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboard" className="active">
                            Panel
                        </Link>
                        <Link to="/parejas">Parejas</Link>
                    </nav>
                </div>

                <div className="hero">
                    <div className="hero-left">
                        <img
                            className="avatar"
                            src="https://cdn-icons-png.flaticon.com/512/7153/7153150.png"
                            alt={`${cliente.primerNombre || ''} ${cliente.primerApellido || ''}`}
                        />
                        <div>
                            <p className="greet-sub">Hola,</p>
                            <p className="greet-name">{cliente.primerNombre} {cliente.primerApellido}</p>
                            <p className="greet-role">Cliente</p>
                        </div>
                    </div>

                    <div className="hero-center">
                        <div className="credit-ring">
                            <svg viewBox="0 0 190 190">
                                <circle
                                    cx="95"
                                    cy="95"
                                    r="82"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.12)"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="95"
                                    cy="95"
                                    r="82"
                                    fill="none"
                                    stroke="#e8b84b"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circunferenciaAnillo}
                                    strokeDashoffset={offsetAnillo}
                                />
                            </svg>
                            <div className="credit-ring-label">
                                <p className="cr-caption">Crédito Disponible</p>
                                <p className="cr-amount">{formatearMoneda(cupoDisponible)}</p>
                            </div>
                        </div>
                        <div className="credit-sub">
                            <p className="credit-range">[ {formatearMoneda(cupoDisponible)} / {formatearMoneda(cupoTotalReal)} ]</p>
                            <p className="credit-used">{porcentajeUsado}% Usado</p>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="wallet-row">
                            <div>
                                <p className="wallet-caption">Tu Billetera (Cupo Total)</p>
                                <p className="wallet-amount">{formatearMoneda(cupoTotalReal)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-grid">

                    <div>
                        <div className="col-title">
                            Parejas <span className="minus">—</span>
                        </div>

                        {loadingPartners ? (
                            <p style={{ color: "#aaa", padding: "10px" }}>Cargando parejas...</p>
                        ) : partners.length === 0 ? (
                            <p style={{ color: "#aaa", padding: "10px" }}>No hay parejas asociadas</p>
                        ) : (
                            partners.map((p) => (
                                <div className="partner-card" key={p.id}>
                                    <div className="partner-head">
                                        <p className="partner-name">{p.name}</p>
                                        <div className="partner-avatars">
                                            {p.avatars.map((src, i) => (
                                                <img key={i} src={src} alt={p.name} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="partner-meta">Asignado: {p.assigned}</p>
                                    <p className="partner-meta">Consumido: {p.used}</p>
                                    <div className="progress-track">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${p.progress}%` }}
                                        />
                                    </div>
                                    <button
                                        className="btn-config"
                                        onClick={() => navigate(`/parejas/${p.id}/restricciones`)}
                                    >
                                        Configurar Restricciones
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        <div className="col-title">
                            Sobrecupo <span className="minus">—</span>
                        </div>

                        <div className="mini-card">
                            <div className="mini-title">Sobrecupos Activos</div>

                            {overlimits.length === 0 ? (
                                <p style={{ color: "#aaa", padding: "10px", fontSize: "13px" }}>No hay solicitudes pendientes.</p>
                            ) : (
                                overlimits.map((o) => (
                                    <div className="sobrecupo-item" key={o.id}>
                                        <div className="sc-left">
                                            <div className="sc-avatars">
                                                {o.avatars.map((src, i) => (
                                                    <img key={i} src={src} alt={o.name} />
                                                ))}
                                            </div>
                                            <div>
                                                <p className="sc-name">{o.name}</p>
                                                <p className="sc-amount">{o.amount}</p>
                                            </div>
                                        </div>

                                        {o.status === "esperando_cliente" ? (
                                            <div className="alert-actions" style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    className="btn-approve"
                                                    style={{ padding: "4px 8px", cursor: "pointer" }}
                                                    onClick={() => handleResponderSobrecupo(o.id, true)}
                                                >
                                                    Autorizar
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    style={{ padding: "4px 8px", cursor: "pointer" }}
                                                    onClick={() => handleResponderSobrecupo(o.id, false)}
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`badge ${o.status}`}>
                            {statusLabel[o.status] || o.status}
                        </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;