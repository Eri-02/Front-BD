import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({
    user: "",
    password: "",
  });

  const [showLoginPass, setShowLoginPass] = useState(false);

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    user: "",
    password: "",
  });

  const [showSignupPass, setShowSignupPass] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleLoginChange = (e) => {
    const { id, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignupChange = (e) => {
    const { id, value } = e.target;

    setSignupData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "password") {

      let score = 0;

      if (value.length >= 8) score++;

      if (/[A-Z]/.test(value) && /[0-9]/.test(value))
        score++;

      if (/[^A-Za-z0-9]/.test(value) && value.length >= 10)
        score++;

      setPasswordStrength(score);

    }
  };

const handleLoginSubmit = (e) => {
  e.preventDefault();

  if (
    loginData.user === "cliente" &&
    loginData.password === "1234"
  ) {
    console.log("Voy al dashboard");
    navigate("/dashboard");
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
};

  const handleSignupSubmit = (e) => {

    e.preventDefault();

    console.log("Registro:", signupData);

    alert("Registro de prueba.");

  };

  const strengthColors = [
    "#c0574f",
    "#e8b84b",
    "#5aa06a",
  ];
  
  return (
    <div className="login-page">
      <div className="auth-shell">
        {/* Izquierda */}
        <div className="brand-panel">
          
        </div>

        {/* derecha*/}
        <div className="form-panel">
          <div className="form-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Crear cuenta
            </button>
          </div>

          {/* para el login */}
          {activeTab === "login" && (
            <div id="loginForm">
              <h1 className="form-title">Bienvenido de nuevo</h1>
              <p className="form-desc">
                Ingresa tus credenciales para acceder.
              </p>

              <form onSubmit={handleLoginSubmit}>
                <div className="field">
                  <label htmlFor="user">Usuario</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      id="user"
                      placeholder="Usuario"
                      value={loginData.user}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="password">Contraseña</label>
                  <div className="input-wrap">
                  
                    <input
                      type={showLoginPass ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowLoginPass((v) => !v)}
                    >
                      {showLoginPass ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </div>

                

                <button type="submit" className="btn-primary">
                  Iniciar sesión
                </button>
              </form>

              <p className="switch-line">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="link-gold"
                  onClick={() => setActiveTab("signup")}
                >
                  Regístrate
                </button>
              </p>
            </div>
          )}

          {/* formulario registro */}
          {activeTab === "signup" && (
            <div id="signupForm">
              <h1 className="form-title">Crea tu cuenta</h1>
              <p className="form-desc">
                Unete a nosotros!.
              </p>

              <form onSubmit={handleSignupSubmit}>
                <div className="field name-grid">
                  <div>
                    <label htmlFor="firstName">Nombre</label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Franklin"
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName">Apellido</label>
                    <div className="input-wrap">
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Vanderbilt"
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="user">Usuario</label>
                  <div className="input-wrap">

                      <input
                          type="text"
                          id="user"
                          placeholder="Ingrese su usuario"
                          value={signupData.user}
                          onChange={handleSignupChange}
                          required
                      />

                  </div>
                </div>

                <div className="field">
                  {/* corregido: htmlFor ahora coincide con el id del input ("password") */}
                  <label htmlFor="password">Contraseña</label>
                  <div className="input-wrap">
                  
                    <input
                      type={showSignupPass ? "text" : "password"}
                      id="password"
                      placeholder="Mínimo 8 caracteres"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowSignupPass((v) => !v)}
                    >
                      {showSignupPass ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                  <div className="strength-meter">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          background:
                            i < passwordStrength
                              ? strengthColors[passwordStrength - 1]
                              : "#e7e2d3",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="row-between" style={{ marginBottom: 20 }}>
                  <label className="remember">
                    <input type="checkbox" required />
                    Acepto los{" "}
                    <button type="button" className="link-gold" style={{ marginLeft: 4 }}>
                      Términos
                    </button>
                  </label>
                </div>

                <button type="submit" className="btn-primary">
                  Crear cuenta
                </button>
              </form>

              <p className="switch-line">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  className="link-gold"
                  onClick={() => setActiveTab("login")}
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;