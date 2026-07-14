import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../service/service";
import "./DashboardPareja.css";

const almacenesQuemados = [
    { id_almacen: 1, nombre: "Almacén Centro" },
    { id_almacen: 2, nombre: "Almacén Norte" },
];

function DashboardPareja() {
    const navigate = useNavigate();

    const [pareja, setPareja] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [compras, setCompras] = useState([]);
    const [restricciones, setRestricciones] = useState([]);
    const [filterAlmacen, setFilterAlmacen] = useState("");
    const [montoSobrecupo, setMontoSobrecupo] = useState("");
    const [almacenes, setAlmacenes] = useState([]);
    const [almacenSobrecupo, setAlmacenSobrecupo] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const storedUserData = localStorage.getItem("userData");

        if (!role || role !== "pareja" || !storedUserData) {
            localStorage.clear();
            navigate("/");
            return;
        }

        const datosIniciales = JSON.parse(storedUserData);

        const cargarTodo = async () => {
            try {
                let parejaFresh = datosIniciales;
                if (service.obtenerParejaPorId) {
                    const resPareja = await service.obtenerParejaPorId(datosIniciales.idPareja);
                    parejaFresh = resPareja?.data || resPareja || datosIniciales;
                    setPareja(parejaFresh);
                }

                if (service.obtenerComprasPorPareja) {
                    const resCompras = await service.obtenerComprasPorPareja(parejaFresh.idPareja);
                    setCompras(Array.isArray(resCompras) ? resCompras : (resCompras?.data || []));
                }

                if (service.obtenerRestriccionesPorPareja) {
                    const resRest = await service.obtenerRestriccionesPorPareja(parejaFresh.idPareja);
                    setRestricciones(Array.isArray(resRest) ? resRest : (resRest?.data || []));
                }

                if (parejaFresh.idCliente) {
                    const resCliente = await service.obtenerClientePorId(parejaFresh.idCliente);
                    setCliente(resCliente?.cliente || resCliente?.data || resCliente);
                }


                const resAlmacenes = await service.obtenerAlmacenes();
                setAlmacenes(Array.isArray(resAlmacenes) ? resAlmacenes : (resAlmacenes?.data || []));
            } catch (error) {
                console.error("Error al cargar:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarTodo();
    }, [navigate]);
    const generarSobrecupo = async () => {

        if (!almacenSobrecupo) {
            alert("Por favor selecciona un almacén.");
            return;
        }

        if (!montoSobrecupo || Number(montoSobrecupo) <= 0) {
            alert("Ingresa un monto válido.");
            return;
        }

        try {
            const datos = {
                idPareja: pareja.idPareja,
                idAlmacen: Number(almacenSobrecupo),
                montoSobrecupo: Number(montoSobrecupo)
            };

            console.log("Enviando ID Almacén:", datos.idAlmacen);
            await service.solicitarSobrecupo(datos);

            alert("¡Solicitud enviada con éxito al almacén " + almacenSobrecupo );
            setMontoSobrecupo("");
            setAlmacenSobrecupo("");
        } catch (error) {
            alert("Error: " + (error.message || "El almacén seleccionado no tiene supervisor"));
        }
    };




    const formatearMoneda = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(Number(v) || 0);
    const formatearHora = (h) => (h ? h.substring(0, 5) : "-");

    const cupoDisponible = pareja ? (Number(pareja.cupoAsignado) || 0) : 0;

    const radio = 82;
    const circunferencia = 2 * Math.PI * radio;
    const offsetAnillo = 0;

    const comprasFiltradas = compras.filter((c) => !filterAlmacen || (c.idAlmacen || c.id_almacen) === Number(filterAlmacen));

    if (loading) return <div style={{ color: "#fff", padding: "20px" }}>Cargando datos...</div>;

    return (
        <div className="dashboard-page">
            <div className="shell">
                <div className="navbar">
                    <nav className="links">
                        <Link to="/dashboardPareja" className="active">Panel</Link>
                        <Link to="/productos/pareja">Productos</Link>
                    </nav>
                </div>

                <div className="hero">
                    <div className="hero-left">
                        <img className="avatar" src="https://cdn-icons-png.flaticon.com/512/7153/7153150.png" alt="Avatar" />
                        <div>
                            <p className="greet-sub">Hola,</p>
                            <p className="greet-name">{pareja?.primerNombre} {pareja?.primerApellido}</p>
                            <p className="greet-role">Pareja</p>
                        </div>
                    </div>

                    <div className="hero-center">
                        <div className="credit-ring" style={{ position: 'relative', width: '190px', height: '190px' }}>
                            <svg viewBox="0 0 190 190" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                <circle cx="95" cy="95" r={radio} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
                                <circle cx="95" cy="95" r={radio} fill="none" stroke="#e8b84b" strokeWidth="10" strokeLinecap="round" strokeDasharray={circunferencia} strokeDashoffset={offsetAnillo} />
                            </svg>
                            <div className="credit-ring-label" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <p className="cr-caption" style={{ margin: 0 }}>Disponible</p>
                                <p className="cr-amount" style={{ fontSize: "1.4rem", margin: 0, fontWeight: "bold" }}>{formatearMoneda(cupoDisponible)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="wallet-row">
                            <div>
                                <p className="wallet-caption">Cuenta Asociada</p>
                                <p className="wallet-amount">{cliente ? `${cliente.primerNombre} ${cliente.primerApellido}` : "Sin asociar"}</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/*CAMBAIR ESTOOOOO PROVISIONAL PARA GENERAR LOS SOBRECUPOS*/}
                <div className="main-grid">
                    <div>
                        <div
                            style={{
                                position: "absolute",
                                top: "380px",
                                right: "200px",
                                width: "260px",
                                background: "white",
                                borderRadius: "14px",
                                padding: "18px",
                                border: "1px solid rgba(255,255,255,0.08)"
                            }}
                        >
                            <h4
                                style={{
                                    margin: 0,
                                    marginBottom: "12px",
                                    color: "black",
                                    fontSize: "15px"
                                }}
                            >
                                Generar solicitud de sobrecupo
                            </h4>

                            <input
                                type="number"
                                placeholder="Monto solicitado"
                                value={montoSobrecupo}
                                onChange={(e) => setMontoSobrecupo(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #555",
                                    background: "white",
                                    color: "black",
                                    marginBottom: "12px",
                                    boxSizing: "border-box"
                                }}
                            />
                            <select
                                value={almacenSobrecupo}
                                onChange={(e) => setAlmacenSobrecupo(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #555",
                                    background: "white",
                                    color: "black",
                                    marginBottom: "12px",
                                    boxSizing: "border-box"
                                }}
                            >
                                <option value="">Seleccione un almacén</option>

                                {almacenes.map((almacen) => (
                                    <option
                                        key={almacen.idAlmacen || almacen.id_almacen}
                                        value={almacen.idAlmacen || almacen.id_almacen}
                                    >
                                        {almacen.nombre || almacen.nombreAlmacen}
                                    </option>
                                ))}
                            </select>
                            <button
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "white",
                                    color: "black",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                                onClick={generarSobrecupo}
                            >
                                Generar
                            </button>
                        </div>
                        <div className="col-title">Mis Restricciones <span className="minus">—</span></div>
                        {restricciones.length === 0 ? <p style={{ color: "#aaa", padding: "10px" }}>Sin restricciones activas.</p> :
                            restricciones.map((r) => (
                                <div className="partner-card" key={r.idRestriccion}>
                                    <div className="partner-head"><p className="partner-name">{r.diaSemana}</p></div>
                                    <p className="partner-meta">{formatearHora(r.horaInicio)} - {formatearHora(r.horaFin)}</p>
                                </div>
                            ))
                        }
                    </div>












                    <div>
                        <div className="invested-card">
                            <div className="col-title">Mis Compras <span className="minus">—</span></div>
                            <select className="filter-select" onChange={(e) => setFilterAlmacen(e.target.value)}>
                                <option value="">Filtrar por Almacén</option>
                                {almacenesQuemados.map((a) => <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>)}
                            </select>
                            <table className="tx-table">
                                <thead><tr><th>Fecha</th><th>Hora</th><th>Monto</th></tr></thead>
                                <tbody>
                                {comprasFiltradas.map((c, i) => (
                                    <tr key={i}><td>{c.fecha}</td><td>{c.hora}</td><td>{formatearMoneda(c.monto)}</td></tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPareja;