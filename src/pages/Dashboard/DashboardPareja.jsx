import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardPareja.css";

const restriccionesQuemadas = [
    { id_restriccion: 1, dia_semana: "Lunes", hora_inicio: "08:00", hora_fin: "12:00" },
    { id_restriccion: 2, dia_semana: "Miercoles", hora_inicio: "14:00", hora_fin: "18:00" },
    { id_restriccion: 3, dia_semana: "Viernes", hora_inicio: "09:00", hora_fin: "20:00" },
];

const comprasQuemadas = [
    { id_compra: 1, fecha: "2026-07-10", hora: "14:30", monto: 420000, id_almacen: 1 },
    { id_compra: 2, fecha: "2026-07-08", hora: "10:15", monto: 180000, id_almacen: 2 },
    { id_compra: 3, fecha: "2026-07-05", hora: "19:02", monto: 650000, id_almacen: 1 },
];

const almacenesQuemados = [
    { id_almacen: 1, nombre: "Almacén Centro" },
    { id_almacen: 2, nombre: "Almacén Norte" },
];

function DashboardPareja() {
    const navigate = useNavigate();

    const [pareja] = useState(() => {
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

    const [cliente, setCliente] = useState(null);
    const [loadingCliente, setLoadingCliente] = useState(true);
    const [filterAlmacen, setFilterAlmacen] = useState("");

    const cupoAsignado = Number(pareja?.cupoAsignado) || 3000000;
    const cupoConsumido = 1150000;

    useEffect(() => {
        const role = localStorage.getItem("userRole");

        if (!role || role !== "pareja" || !pareja) {
            localStorage.clear();
            navigate("/");
            return;
        }

        const cargarClienteAsociado = async () => {
            try {
                const idCliente = pareja.idCliente;
                if (idCliente) {
                    const respuestaCliente = await service.obtenerClientePorId(idCliente);
                    const clienteData = respuestaCliente?.cliente || respuestaCliente?.data || respuestaCliente;
                    setCliente(clienteData);
                }
            } catch (error) {
                console.error("Error al cargar el cliente asociado:", error);
            } finally {
                setLoadingCliente(false);
            }
        };

        cargarClienteAsociado();
    }, [pareja, navigate]);

    if (!pareja) {
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

    const formatearFecha = (fecha) => {
        if (!fecha) return "-";
        const partes = fecha.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    const formatearHora = (hora) => {
        if (!hora) return "-";
        const partes = hora.split(":");
        return `${partes[0]}:${partes[1]}`;
    };

    const cupoDisponible = cupoAsignado - cupoConsumido;
    const porcentajeUsado = cupoAsignado > 0 ? Math.round((cupoConsumido / cupoAsignado) * 100) : 0;

    const circunferenciaAnillo = 515.2;
    const offsetAnillo = circunferenciaAnillo - (porcentajeUsado / 100) * circunferenciaAnillo;

    const comprasFiltradas = comprasQuemadas.filter((c) => {
        if (!filterAlmacen) return true;
        return c.id_almacen === Number(filterAlmacen);
    });

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboardPareja" className="active">
                            Panel
                        </Link>
                        <Link to="/mis-compras">Mis Compras</Link>
                        <Link to="/productos/pareja">Productos</Link>
                    </nav>
                </div>

                <div className="hero">
                    <div className="hero-left">
                        <img
                            className="avatar"
                            src="https://cdn-icons-png.flaticon.com/512/7153/7153150.png"
                            alt={`${pareja.primerNombre || ''} ${pareja.primerApellido || ''}`}
                        />
                        <div>
                            <p className="greet-sub">Hola,</p>
                            <p className="greet-name">{pareja.primerNombre} {pareja.primerApellido}</p>
                            <p className="greet-role">Pareja</p>
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
                                <p className="cr-caption">Gastado</p>
                                <p className="cr-amount">{formatearMoneda(cupoConsumido)}</p>
                            </div>
                        </div>
                        <div className="credit-sub">
                            <p className="credit-range">[ {formatearMoneda(cupoConsumido)} / {formatearMoneda(cupoAsignado)} ]</p>
                            <p className="credit-used">{porcentajeUsado}% Usado</p>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="wallet-row">
                            <div>
                                <p className="wallet-caption">Cuenta Asociada</p>
                                <p className="wallet-amount">
                                    {loadingCliente
                                        ? "Cargando..."
                                        : cliente
                                            ? `${cliente.primerNombre || ''} ${cliente.primerApellido || ''}`
                                            : "Sin asociar"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-grid">

                    <div>
                        <div className="col-title">
                            Mis Restricciones <span className="minus">—</span>
                        </div>

                        {restriccionesQuemadas.length === 0 ? (
                            <p style={{ color: "#aaa", padding: "10px" }}>No hay restricciones configuradas</p>
                        ) : (
                            restriccionesQuemadas.map((r) => (
                                <div className="partner-card" key={r.id_restriccion}>
                                    <div className="partner-head">
                                        <p className="partner-name">{r.dia_semana}</p>
                                    </div>
                                    <p className="partner-meta">
                                        {formatearHora(r.hora_inicio)} - {formatearHora(r.hora_fin)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        <div className="invested-card">
                            <div className="col-title" style={{ marginBottom: 8 }}>
                                Mis Compras <span className="minus">—</span>
                            </div>

                            <div className="spend-summary">
                                <div className="spend-item gasto">
                                    <p className="lbl">Total Gastado</p>
                                    <p className="val">{formatearMoneda(cupoConsumido)}</p>
                                </div>
                                <div className="spend-item compra">
                                    <p className="lbl">Disponible</p>
                                    <p className="val">{formatearMoneda(cupoDisponible)}</p>
                                </div>
                            </div>

                            <select
                                className="filter-select"
                                value={filterAlmacen}
                                onChange={(e) => setFilterAlmacen(e.target.value)}
                            >
                                <option value="">Filtrar por Almacén</option>
                                {almacenesQuemados.map((a) => (
                                    <option key={a.id_almacen} value={a.id_almacen}>
                                        {a.nombre}
                                    </option>
                                ))}
                            </select>

                            {comprasFiltradas.length === 0 ? (
                                <p style={{ color: "#aaa", padding: "10px" }}>No hay compras en este almacén</p>
                            ) : (
                                <table className="tx-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Monto</th>
                                            <th>Almacén</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comprasFiltradas.map((c) => (
                                            <tr key={c.id_compra}>
                                                <td>{formatearFecha(c.fecha)}</td>
                                                <td>{formatearHora(c.hora)}</td>
                                                <td className="gasto">{formatearMoneda(c.monto)}</td>
                                                <td>
                                                    {almacenesQuemados.find(a => a.id_almacen === c.id_almacen)?.nombre || c.id_almacen}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="col-title">
                            Mi Cupo <span className="minus">—</span>
                        </div>

                        <div className="mini-card">
                            <div className="mini-title">Resumen de Cupo</div>
                            <p className="partner-meta">Asignado: {formatearMoneda(cupoAsignado)}</p>
                            <p className="partner-meta">Consumido: {formatearMoneda(cupoConsumido)}</p>
                            <p className="partner-meta">Disponible: {formatearMoneda(cupoDisponible)}</p>
                            <div className="progress-track">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${porcentajeUsado}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPareja;