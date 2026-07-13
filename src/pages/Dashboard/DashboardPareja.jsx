import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardPareja.css";

/*
    ============================================================
    ENDPOINTS DISPONIBLES QUE SÍ APLICAN
    ============================================================
    - service.obtenerClientePorId(idCliente) -> datos del cliente
      vinculado a esta pareja (nombre, correo, cupo total, etc).
    - service.obtenerCupoConsumido(idCliente) -> consumo de cupo.
      OJO: recibe idCliente, no idPareja. Falta confirmar con el
      backend si devuelve un arreglo con el consumo de CADA pareja
      del cliente (en cuyo caso hay que filtrar por idPareja propio)
      o si devuelve solo un total agregado. Mientras se confirma,
      se deja mockeado el cálculo del cupo restante.

    ============================================================
    ENDPOINTS QUE FALTAN (mientras tanto, todo quemado abajo)
    ============================================================
    - GET /Pareja/ObtenerPareja?idPareja=... (o similar) para traer
      los propios datos de la pareja logueada (nombre, cupoAsignado,
      correo, etc). Ahora mismo se usa localStorage "userData",
      pero cupoAsignado / cupoUsado están quemados.
    - GET /Pareja/ObtenerRestricciones?idPareja=... para la sección
      "Mis restricciones" (categorías o productos bloqueados).
    - GET /Pareja/ObtenerCompras?idPareja=... para el historial de
      "Mis últimas compras".
    ============================================================
*/

// TODO backend: reemplazar por datos reales cuando exista el
// endpoint de restricciones por pareja
const mockRestricciones = [
    { id: 1, categoria: "Bebidas alcohólicas", motivo: "Restricción del cliente" },
    { id: 2, categoria: "Cigarrillos", motivo: "Restricción del cliente" },
    { id: 3, categoria: "Juegos de azar", motivo: "Política del almacén" },
];

// TODO backend: reemplazar por historial real de compras de la pareja
const mockCompras = [
    { id: 1, date: "2026-07-10", time: "14:30", producto: "Mercado del mes", amount: "$420.000" },
    { id: 2, date: "2026-07-08", time: "10:15", producto: "Ropa", amount: "$180.000" },
    { id: 3, date: "2026-07-05", time: "19:02", producto: "Electrodomésticos", amount: "$650.000" },
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

    // TODO backend: reemplazar cupoTotal/cupoUsado quemados por la
    // respuesta real de service.obtenerCupoConsumido(idCliente),
    // una vez confirmada la forma exacta del dato para esta pareja.
    const [cupo] = useState({
        cupoTotal: 3000000,
        cupoUsado: 1150000,
    });

    useEffect(() => {
        const role = localStorage.getItem("userRole");

        if (!role || role !== "PAREJA" || !pareja) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const cargarCliente = async () => {
            try {
                const data = await service.obtenerClientePorId(pareja.idCliente);
                setCliente(data?.data || data);
            } catch (error) {
                console.error("Error al cargar el cliente vinculado:", error);
                setCliente(null);
            } finally {
                setLoadingCliente(false);
            }
        };

        cargarCliente();
    }, [pareja, navigate]);

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(numero);
    };

    const cupoRestante = Math.max(cupo.cupoTotal - cupo.cupoUsado, 0);
    const progreso =
        cupo.cupoTotal > 0
            ? Math.min((cupo.cupoUsado / cupo.cupoTotal) * 100, 100)
            : 0;

    if (!pareja) {
        return <div style={{ color: "#fff", padding: "20px" }}>Verificando credenciales...</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboard" className="active">
                            Panel
                        </Link>
                        <Link to="/mis-compras">Mis Compras</Link>
                        <Link to="/productos-pareja">Productos</Link>
                    </nav>
                </div>

                <div className="hero">
                    <div className="hero-left">
                        <img
                            className="avatar"
                            src="https://cdn-icons-png.flaticon.com/512/7153/7153150.png"
                            alt={`${pareja.primerNombre || ""} ${pareja.primerApellido || ""}`}
                        />
                        <div>
                            <p className="greet-sub">Hola,</p>
                            <p className="greet-name">
                                {pareja.primerNombre} {pareja.primerApellido}
                            </p>
                            <p className="greet-role">Pareja</p>
                        </div>
                    </div>

                    <div className="hero-center">
                            <div className="solicitudes-count">
                                <p className="sol-caption">Cupo disponible</p>
                                <p className="sol-amount-money">{formatearMoneda(cupoRestante)}</p>
                            </div>
                            <div className="sol-sub">
                                <p className="sol-detail">
                                    {formatearMoneda(cupo.cupoUsado)} usado de {formatearMoneda(cupo.cupoTotal)}
                                </p>
                                <div className="hero-progress-track">
                                    <div
                                        className="hero-progress-fill"
                                        style={{ width: `${progreso}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                    <div className="hero-right">
                        <div className="wallet-row">
                            <div>
                                <p className="wallet-caption">Cliente vinculado</p>
                                <p className="wallet-amount">
                                    {loadingCliente
                                        ? "Cargando..."
                                        : cliente
                                        ? `${cliente.primerNombre} ${cliente.primerApellido}`
                                        : "No disponible"}
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

                        {mockRestricciones.length === 0 ? (
                            <p style={{ color: "#aaa", padding: "10px" }}>No tienes restricciones activas</p>
                        ) : (
                            mockRestricciones.map((r) => (
                                <div className="partner-card" key={r.id}>
                                    <div className="partner-head">
                                        <p className="partner-name">{r.categoria}</p>
                                    </div>
                                    <p className="partner-meta">{r.motivo}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        <div className="invested-card">
                            <div className="col-title" style={{ marginBottom: 8 }}>
                                Mis Últimas Compras <span className="minus">—</span>
                            </div>

                            {mockCompras.length === 0 ? (
                                <p className="empty-note">No tienes compras registradas</p>
                            ) : (
                                mockCompras.map((c) => (
                                    <div className="alert-item" key={c.id}>
                                        <div className="alert-left">
                                            <div>
                                                <p className="alert-name">{c.producto}</p>
                                                <p className="alert-meta">
                                                    {c.date} · {c.time}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="alert-amount">{c.amount}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="col-title">
                            Datos de la Pareja <span className="minus">—</span>
                        </div>

                        <div className="mini-card">
                            <div className="mini-title">Información Personal</div>

                            <p className="dato-item">
                                <strong>Usuario:</strong> {pareja.nombreUsuario}
                            </p>
                            <p className="dato-item">
                                <strong>Nombre:</strong> {pareja.primerNombre} {pareja.segundoNombre}
                            </p>
                            <p className="dato-item">
                                <strong>Apellido:</strong> {pareja.primerApellido} {pareja.segundoApellido}
                            </p>
                            <p className="dato-item">
                                <strong>Correo:</strong> {pareja.correoElectronico}
                            </p>
                            <p className="dato-item">
                                <strong>Cupo asignado:</strong> {formatearMoneda(cupo.cupoTotal)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPareja;