import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import service from "../../service/service.js";

function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [rolUsuario, setRolUsuario] = useState("cliente");

    const [loginData, setLoginData] = useState({
        user: "",
        password: "",
    });

    const [showLoginPass, setShowLoginPass] = useState(false);

    const [datosRegistro, setDatosRegistro] = useState({
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        nombreUsuario: "",
        contraseniaUsuario: "",
        correoElectronico: "",
        cupoTotal: 0,
        idAlmacen: "",
    });

    const [showSignupPass, setShowSignupPass] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [almacenes, setAlmacenes] = useState([]);

    useEffect(() => {
        if (activeTab === "signup" && rolUsuario === "supervisor") {
            service.obtenerAlmacenes()
                .then(data => {
                    setAlmacenes(data);
                })
                .catch(error => {
                    console.error("Error al cargar almacenes de la BD:", error);
                });
        }
    }, [activeTab, rolUsuario]);

    const handleLoginChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSignupChange = (e) => {
        const { id, value } = e.target;
        setDatosRegistro((prev) => ({
            ...prev,
            [id]: value,
        }));

        if (id === "contraseniaUsuario") {
            let score = 0;
            if (value.length >= 8) score++;
            if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value) && value.length >= 10) score++;
            setPasswordStrength(score);
        }
    };

    const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginData.user || !loginData.password) {
        alert("Por favor ingresa usuario y contraseña");
        return;
    }

    try {
        let respuesta;
        
        
        if (rolUsuario === "supervisor") {
            respuesta = await service.autenticarSupervisor(loginData.user, loginData.password);
        } else if (rolUsuario === "pareja") {
            respuesta = await service.autenticarPareja(loginData.user, loginData.password);
        } else {
            // Cliente (default)
            respuesta = await service.autenticarCliente(loginData.user, loginData.password);
        }

        
        if (respuesta && (respuesta.status === 200 || respuesta.datos)) {
            // Guardar en localStorage
            localStorage.setItem("userRole", respuesta.rol || rolUsuario);
            localStorage.setItem("userData", JSON.stringify(respuesta.datos || respuesta));
            
            const nombre = respuesta.datos?.primerNombre || 
                          respuesta.primerNombre || 
                          "Usuario";
            
            alert(`¡Bienvenid@, ${nombre}!`);

            
            if (rolUsuario === "supervisor") {
                navigate("/dashboardSupervisor");
            } else if (rolUsuario === "pareja") {
                navigate("/dashboardPareja");
            } else {
                navigate("/dashboard");
            }
        } else {
            alert("Error al iniciar sesión. Verifica tus credenciales.");
        }
    } catch (error) {
        console.error("Error en autenticación:", error);
        const mensajeError = error.response?.data?.message || 
                            error.message || 
                            "Credenciales incorrectas o error de conexión";
        alert(`Error al iniciar sesión: ${mensajeError}`);
    }
};
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            let respuesta;
            if (rolUsuario === "supervisor") {
                const datosSupervisor = {
                    ...datosRegistro,
                    idAlmacen: parseInt(datosRegistro.idAlmacen, 10)
                };
                respuesta = await service.registrarSupervisor(datosSupervisor);
            } else {
                respuesta = await service.registrarCliente(datosRegistro);
            }

            if (respuesta.status === 201 || respuesta.status === undefined) {

                alert("¡Registro exitoso!");
                setDatosRegistro({
                    primerNombre: "",
                    segundoNombre: "",
                    primerApellido: "",
                    segundoApellido: "",
                    nombreUsuario: "",
                    contraseniaUsuario: "",
                    correoElectronico: "",
                    cupoTotal: 0,
                    idAlmacen: "",
                });
                setActiveTab("login");
            }
        } catch (error) {
            const mensajeError = error.response?.data?.message || "Error de conexion";
            alert(`Error: ${mensajeError}`);
        }
    };

    const strengthColors = [
        "#c0574f",
        "#e8b84b",
        "#5aa06a",
    ];

    return (
        <div className="login-page">
            <div className="auth-shell">
                <div className="brand-panel"></div>

                <div className="form-panel">
                    <div className="contenedor-rol-flotante">
                        <span className="texto-rol-etiqueta">Ingresar como:</span>
                        <div className="grupo-botones-rol">
                            <button
                                type="button"
                                className={`boton-cambiar-rol ${rolUsuario === "cliente" ? "activo" : ""}`}
                                onClick={() => setRolUsuario("cliente")}
                            >
                                Soy Cliente
                            </button>
                            <button
                                type="button"
                                className={`boton-cambiar-rol ${rolUsuario === "supervisor" ? "activo" : ""}`}
                                onClick={() => setRolUsuario("supervisor")}
                            >
                                Soy Supervisor
                            </button>
                            <button
                                type="button"
                                className={`boton-cambiar-rol ${rolUsuario === "pareja" ? "activo" : ""}`}
                                onClick={() => setRolUsuario("pareja")}
                            >
                                Soy Pareja
                            </button>
                        </div>
                    </div>

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

                    {activeTab === "login" && (
                        <div id="loginForm">
                            <h1 className="form-title">Bienvenido de nuevo</h1>
                            <p className="form-desc">Ingresa tus credenciales para acceder</p>

                            <form onSubmit={handleLoginSubmit}>
                                <div className="field">
                                    <label htmlFor="user">Usuario</label>
                                    <div className="input-wrap">
                                        <input type="text" id="user" placeholder="Usuario" value={loginData.user} onChange={handleLoginChange} required />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="password">Contraseña</label>
                                    <div className="input-wrap">
                                        <input type={showLoginPass ? "text" : "password"} id="password" placeholder="••••••••" value={loginData.password} onChange={handleLoginChange} required />
                                        <button type="button" className="toggle-pass" onClick={() => setShowLoginPass((v) => !v)}>
                                            {showLoginPass ? "Ocultar" : "Ver"}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary">Iniciar sesión</button>
                            </form>

                            <p className="switch-line">
                                ¿No tienes cuenta?{" "}
                                <button type="button" className="link-gold" onClick={() => setActiveTab("signup")}>
                                    Regístrate
                                </button>
                            </p>
                        </div>
                    )}

                    {activeTab === "signup" && (
                        <div id="signupForm">
                            <h1 className="form-title">Crea tu cuenta</h1>
                            <p className="form-desc">¡Únete a nosotros!</p>

                            <form onSubmit={handleSignupSubmit}>
                                <div className="field name-grid">
                                    <div>
                                        <label htmlFor="primerNombre">Primer Nombre</label>
                                        <div className="input-wrap">
                                            <input type="text" id="primerNombre" placeholder="Diana" value={datosRegistro.primerNombre} onChange={handleSignupChange} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="segundoNombre">Segundo Nombre</label>
                                        <div className="input-wrap">
                                            <input type="text" id="segundoNombre" placeholder="Maria" value={datosRegistro.segundoNombre} onChange={handleSignupChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="field name-grid">
                                    <div>
                                        <label htmlFor="primerApellido">Primer Apellido</label>
                                        <div className="input-wrap">
                                            <input type="text" id="primerApellido" placeholder="Pérez" value={datosRegistro.primerApellido} onChange={handleSignupChange} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="segundoApellido">Segundo Apellido</label>
                                        <div className="input-wrap">
                                            <input type="text" id="segundoApellido" placeholder="Garcia" value={datosRegistro.segundoApellido} onChange={handleSignupChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="field name-grid">
                                    <div>
                                        <label htmlFor="nombreUsuario">Usuario</label>
                                        <div className="input-wrap">
                                            <input type="text" id="nombreUsuario" placeholder="diana123" value={datosRegistro.nombreUsuario} onChange={handleSignupChange} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="correoElectronico">Correo Electrónico</label>
                                        <div className="input-wrap">
                                            <input type="email" id="correoElectronico" placeholder="ejemplo@correo.com" value={datosRegistro.correoElectronico} onChange={handleSignupChange} required />
                                        </div>
                                    </div>
                                </div>

                                {rolUsuario === "supervisor" ? (
                                    <div className="field">
                                        <label htmlFor="idAlmacen">Almacén Asignado</label>
                                        <div className="input-wrap">
                                            <select
                                                id="idAlmacen"
                                                className="desplegable-personalizado"
                                                value={datosRegistro.idAlmacen}
                                                onChange={handleSignupChange}
                                                required
                                            >
                                                <option value="">-- Selecciona el almacén a supervisar --</option>
                                                {almacenes.map((alm) => (
                                                    <option key={alm.idAlmacen} value={alm.idAlmacen}>
                                                        {alm.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="field">
                                        <label htmlFor="cupoTotal">Cupo de Crédito Solicitado</label>
                                        <div className="input-wrap">
                                            <input type="number" id="cupoTotal" placeholder="Ej: 500000" value={datosRegistro.cupoTotal} onChange={handleSignupChange} required />
                                        </div>
                                    </div>
                                )}

                                <div className="field">
                                    <label htmlFor="contraseniaUsuario">Contraseña</label>
                                    <div className="input-wrap">
                                        <input type={showSignupPass ? "text" : "password"} id="contraseniaUsuario" placeholder="Mínimo 8 caracteres" value={datosRegistro.contraseniaUsuario} onChange={handleSignupChange} required />
                                        <button type="button" className="toggle-pass" onClick={() => setShowSignupPass((v) => !v)}>
                                            {showSignupPass ? "Ocultar" : "Ver"}
                                        </button>
                                    </div>
                                    <div className="strength-meter">
                                        {[0, 1, 2].map((i) => (
                                            <span key={i} style={{ background: i < passwordStrength ? strengthColors[passwordStrength - 1] : "#e7e2d3" }} />
                                        ))}
                                    </div>
                                </div>

                                <div className="row-between" style={{ marginBottom: 20 }}>
                                    <label className="remember">
                                        <input type="checkbox" required />
                                        Acepto los{" "}
                                        <button type="button" className="link-gold" style={{ marginLeft: 4 }}>Términos</button>
                                    </label>
                                </div>

                                <button type="submit" className="btn-primary">
                                    Registrar como {rolUsuario === "supervisor" ? "Supervisor" : "Cliente"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;