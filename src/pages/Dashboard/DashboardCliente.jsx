import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardCliente.css";

const transactions = [
    { id: 1, date: "2026-07-10", time: "14:30", store: "Almacén Central", amount: "$1.5k", type: "gasto", partner: "Luis" }
];

const overlimits = [
    { id: 1, name: "Luis", avatars: ["/imagen.png"], amount: "+$5.0k", status: "pendiente" },
    { id: 2, name: "Diego", avatars: ["/imagen.png"], amount: "+$3.0k", status: "aprobado" },
    { id: 3, name: "Mateo", avatars: ["/imagen.png"], amount: "+$2.0k", status: "rechazado" },
];

const statusLabel = {
    pendiente: "Pendiente",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
};

function Dashboard() {
    const navigate = useNavigate();

    const [cliente] = useState(() => {
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

    const [cupoDisponible, setCupoDisponible] = useState(0);
    const [cupoConsumidoGeneral, setCupoConsumidoGeneral] = useState(0);
    const [cupoTotalReal, setCupoTotalReal] = useState(0);

    const [partners, setPartners] = useState([]);
    const [loadingPartners, setLoadingPartners] = useState(true);

    const [filterPartner, setFilterPartner] = useState("");
    const [requestForm, setRequestForm] = useState({
        pareja: "",
        monto: "",
        motivo: "",
    });

    useEffect(() => {
        const role = localStorage.getItem("userRole");

        if (!role || role !== "CLIENTE" || !cliente) {
            localStorage.clear();
            navigate("/login");
            return;
        }
//Aqui se trae toda lainfo del cupo
        const cargarDatosFinancierosYParejas = async () => {
            try {
                const idCliente = cliente.idCliente || cliente.id;

                if (idCliente) {

                    const respuestaCliente = await service.obtenerClientePorId(idCliente);
                    const clienteData = respuestaCliente?.cliente || respuestaCliente?.data || respuestaCliente;


                    const total = Number(clienteData?.cupoTotal) || Number(cliente.cupoTotal) || 0;
                    setCupoTotalReal(total);


                    const respuestaCupo = await service.obtenerCupoConsumido(idCliente);
                    const consumidoGeneral = Number(respuestaCupo?.cupoConsumido) || 0;
                    setCupoConsumidoGeneral(consumidoGeneral);

                    // Aqui se definbe el cupo restanmte
                    setCupoDisponible(total - consumidoGeneral);

                    const dataParejas = await service.obtenerParejasPorCliente(idCliente);

                    if (Array.isArray(dataParejas)) {
                        const parejasMapeadas = dataParejas.map((p) => {
                            const asignado = Number(p.cupoAsignado) || 0;
                            const consumidoPareja = 0;
                            const progreso = asignado > 0 ? Math.min((consumidoPareja / asignado) * 100, 100) : 0;

                            return {
                                id: p.idPareja,
                                name: `${p.primerNombre} ${p.primerApellido}`,
                                assigned: `$${asignado.toLocaleString("es-CO")}`,
                                used: `$${consumidoPareja.toLocaleString("es-CO")}`,
                                progress: progreso,
                                avatars: ["img/imagen.png"]
                            };
                        });

                        setPartners(parejasMapeadas);

                        if (parejasMapeadas.length > 0) {
                            setRequestForm((prev) => ({ ...prev, pareja: parejasMapeadas[0].name }));
                        }
                    }
                }
            } catch (error) {
                console.error("Error al sincronizar datos:", error);
            } finally {
                setLoadingPartners(false);
            }
        };

        cargarDatosFinancierosYParejas();
    }, [cliente, navigate]);

    const handleRequestChange = (e) => {
        const { id, value } = e.target;
        setRequestForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        alert(`Solicitud enviada para ${requestForm.pareja} `);
    };

    if (!cliente) {
        return <div style={{ color: "#fff", padding: "20px" }}>Verificando credenciales...</div>;
    }

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }).format(numero);
    };

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
                        <a>Compras</a>
                        <a>Contabilidad</a>
                        <a>Configuración</a>
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
                                    <button className="btn-config">Configurar Restricciones</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        <div className="invested-card">
                            <div className="col-title" style={{ marginBottom: 8 }}>
                                Compras y Gastos <span className="minus">—</span>
                            </div>

                            <div className="spend-summary">
                                <div className="spend-item compra">
                                    <p className="lbl">Compras del mes</p>
                                    <p className="val">$3.5k</p>
                                </div>
                                <div className="spend-item gasto">
                                    <p className="lbl">Gastos del mes</p>
                                    <p className="val">$1.5k</p>
                                </div>
                            </div>

                            <div className="chart-wrap">
                                <div className="y-labels">
                                    <span>50k</span>
                                    <span>20k</span>
                                    <span>10k</span>
                                </div>
                                <svg viewBox="0 0 420 170" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.55" />
                                            <stop offset="100%" stopColor="#e8b84b" stopOpacity="0.02" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M40,150 C90,150 100,140 130,120 C160,100 170,40 210,32 C250,25 260,60 300,90 C330,112 350,140 400,146 L400,170 L40,170 Z"
                                        fill="url(#areaFill)"
                                    />
                                    <path
                                        d="M40,150 C90,150 100,140 130,120 C160,100 170,40 210,32 C250,25 260,60 300,90 C330,112 350,140 400,146"
                                        fill="none"
                                        stroke="#e8b84b"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <select
                                className="filter-select"
                                value={filterPartner}
                                onChange={(e) => setFilterPartner(e.target.value)}
                            >
                                <option value="">Filtrar por Pareja/Almacén</option>
                                {partners.map((p) => (
                                    <option key={p.id} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <table className="tx-table">
                                <thead>
                                <tr>
                                    <th>Fecha/Hora</th>
                                    <th>Almacén (Sucursal)</th>
                                    <th>Monto</th>
                                    <th>Pareja</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transactions
                                    .filter((tx) => !filterPartner || tx.partner === filterPartner)
                                    .map((tx) => (
                                        <tr key={tx.id}>
                                            <td>
                                                {tx.date}
                                                <br />
                                                {tx.time}
                                            </td>
                                            <td>{tx.store}</td>
                                            <td className={tx.type}>{tx.amount}</td>
                                            <td>{tx.partner}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <div className="col-title">
                            Sobrecupo <span className="minus">—</span>
                        </div>

                        <div className="mini-card">
                            <div className="mini-title">Sobrecupos Activos</div>

                            {overlimits.map((o) => (
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
                                    <span className={`badge ${o.status}`}>
                                        {statusLabel[o.status]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mini-card">
                            <div className="mini-title">Solicitar Sobrecupo</div>
                            <form className="request-form" onSubmit={handleRequestSubmit}>
                                <div className="field">
                                    <label htmlFor="pareja">Pareja</label>
                                    <select
                                        id="pareja"
                                        value={requestForm.pareja}
                                        onChange={handleRequestChange}
                                        disabled={loadingPartners || partners.length === 0}
                                    >
                                        {partners.map((p) => (
                                            <option key={p.id} value={p.name}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="monto">Monto solicitado</label>
                                    <input
                                        type="text"
                                        id="monto"
                                        placeholder="$0.00"
                                        value={requestForm.monto}
                                        onChange={handleRequestChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="motivo">Motivo</label>
                                    <input
                                        type="text"
                                        id="motivo"
                                        placeholder="Ej. Compra especial del mes"
                                        value={requestForm.motivo}
                                        onChange={handleRequestChange}
                                    />
                                </div>
                                <button type="submit" className="btn-solicitar" disabled={partners.length === 0}>
                                    Enviar Solicitud  de aprobación sobrecupo
                                </button>
                            </form>
                            <p className="form-hint">
                                La solicitud será revisada por el supervisor
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;