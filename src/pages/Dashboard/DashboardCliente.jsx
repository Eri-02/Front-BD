import { useState } from "react";
import { Link } from "react-router-dom";
import "./DashboardCliente.css";


const partners = [
  {
    id: 1,
    name: "Luis",
    avatars: [
      "img/imagen.png"
    ],
    assigned: "$25k",
    used: "$18.2k",
    progress: 73,
  },
  {
    id: 2,
    name: "Diego",
    avatars: [
      "img/imagen.png",
      "img/imagen.png",
    ],
    assigned: "$25k",
    used: "$18.2k",
    progress: 73,
  },
  {
    id: 3,
    name: "Mateo",
    avatars: [
      "img/imagen.png",
      "img/imagen.png",
    ],
    assigned: "$25k",
    used: "$18.2k",
    progress: 73,
  },
];

const transactions = [
  {
    id: 1,
    date: "12 May 2023",
    time: "11:30",
    store: "Almacén 04",
    amount: "$3.500",
    type: "pos",
    partner: "Luis",
  },
  {
    id: 2,
    date: "09 May 2023",
    time: "15:45",
    store: "Almacén 01",
    amount: "-$1.500",
    type: "neg",
    partner: "Diego",
  },
];

const overlimits = [
  {
    id: 1,
    name: "Luis",
    avatars: [
      "/imagen.png"
    ],
    amount: "+$5.0k",
    status: "pendiente",
  },
  {
    id: 2,
    name: " Diego",
    avatars: [
      "/imagen.png"
    ],
    amount: "+$3.0k",
    status: "aprobado",
  },
  {
    id: 3,
    name: "Mateo",
    avatars: [
      "/imagen.png"
    ],
    amount: "+$2.0k",
    status: "rechazado",
  },
];

const statusLabel = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

function Dashboard() {

  const [filterPartner, setFilterPartner] = useState("");
  const [requestForm, setRequestForm] = useState({
    pareja: partners[0].name,
    monto: "",
    motivo: "",
  });

  const handleRequestChange = (e) => {
    const { id, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    // NO OLVIDAR reemplazar por la llamada real en src/services/
    console.log("Solicitud de sobrecupo:", requestForm);
    alert("Solicitud enviada (demo)");
  };

  return (
    <div className="dashboard-page">
      <div className="shell">
        <div className="navbar">
          <nav className="links">
            <Link to="/dashboard" className="active">
              Panel
            </Link>
            <Link to="/parejas">
    Parejas
</Link>
            <a>Compras</a>
            <a>Contabilidad</a>
            <a>Configuración</a>
          </nav>
        </div>

        <div className="hero">
          <div className="hero-left">
            <img
              className="avatar"
              src="https://i.pravatar.cc/100?img=13"
              alt="Franklin Vanderbilt"
            />
            <div>
              <p className="greet-sub">Buenos días,</p>
              <p className="greet-name">Franklin Vanderbilt</p>
              <p className="greet-role">Gerente de Crédito de Parejas</p>
              <button className="pill-select">Parejas Activas ▾</button>
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
                  strokeDasharray="515.2"
                  strokeDashoffset="226.7"
                />
              </svg>
              <div className="credit-ring-label">
                <div className="coin-icon">🪙</div>
                <p className="cr-caption">Crédito Disponible</p>
                <p className="cr-amount">$115.5k</p>
              </div>
            </div>
            <div className="credit-sub">
              <p className="credit-range">[ $115.5k / $205.5k ]</p>
              <p className="credit-used">56% Usado</p>
            </div>
          </div>

          <div className="hero-right">
            <div className="wallet-row">
              <div>
                <p className="wallet-caption">Tu Billetera</p>
                <p className="wallet-amount">$205.500</p>
              </div>
            </div>
            <div className="allocation-pill">Asignación Total de Parejas</div>
          </div>
        </div>

        <div className="main-grid">
          {/* IZQUIERDA: Parejas */}
          <div>
            <div className="col-title">
              Parejas <span className="minus">—</span>
            </div>

            {partners.map((p) => (
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
            ))}
          </div>

          {/* CENTRO: Compras y Gastos */}
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

          {/* DERECHA: Sobrecupo */}
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
                <button type="submit" className="btn-solicitar">
                  Enviar Solicitud
                </button>
              </form>
              <p className="form-hint">
                La solicitud será revisada por el gerente de crédito y notificada
                a la pareja correspondiente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
