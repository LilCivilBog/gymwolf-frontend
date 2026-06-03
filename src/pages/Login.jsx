import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validar = () => {
    const e = {};
    if (!correo.trim()) e.correo = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      e.correo = "El correo no tiene un formato válido";
    if (!password.trim()) e.password = "La contraseña es obligatoria";
    else if (password.length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres";
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorApi("");
    const erroresForm = validar();
    if (Object.keys(erroresForm).length > 0) {
      setErrores(erroresForm);
      return;
    }
    setErrores({});
    setCargando(true);
    try {
      const rol = await login(correo, password);
      navigate(rol === "admin" ? "/" : "/mi-panel");
    } catch (err) {
      setErrorApi(err.response?.data?.error || "Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = (campo) => ({
    width: "100%",
    padding: "9px 12px",
    marginBottom: "4px",
    border: `1px solid ${errores[campo] ? "#ff6b6b" : "rgba(255,255,255,0.35)"}`,
    borderRadius: "7px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    fontSize: "13px",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#eaf3fb",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "14px",
          width: "340px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,.12)",
        }}
      >
        <div style={{ background: "#1a3a5c", padding: "24px 28px 18px" }}>
          <h1 style={{ color: "white", fontSize: "26px", fontWeight: "700" }}>
            GYMWOLF
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            Sistema de Gestión de Gimnasio
          </p>
        </div>

        <div style={{ padding: "22px 28px", background: "#1a3a5c" }}>
          <form onSubmit={handleLogin} noValidate>
            <label
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "600",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setErrores((p) => ({ ...p, correo: "" }));
              }}
              placeholder="admin@gymwolf.com"
              style={inputStyle("correo")}
            />
            {errores.correo && (
              <p
                style={{
                  color: "#ff8a80",
                  fontSize: "11px",
                  marginBottom: "8px",
                }}
              >
                ⚠ {errores.correo}
              </p>
            )}

            <label
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "600",
                display: "block",
                marginBottom: "4px",
                marginTop: "8px",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrores((p) => ({ ...p, password: "" }));
              }}
              placeholder="••••••••"
              style={inputStyle("password")}
            />
            {errores.password && (
              <p
                style={{
                  color: "#ff8a80",
                  fontSize: "11px",
                  marginBottom: "8px",
                }}
              >
                ⚠ {errores.password}
              </p>
            )}

            {errorApi && (
              <div
                style={{
                  background: "rgba(255,100,100,0.2)",
                  border: "1px solid #ff6b6b",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  marginBottom: "10px",
                }}
              >
                <p style={{ color: "#ff8a80", fontSize: "12px" }}>
                  ⚠ {errorApi}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "10px",
                background: cargando ? "#555" : "#2e6da4",
                color: "white",
                border: "none",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: cargando ? "not-allowed" : "pointer",
                marginTop: "8px",
              }}
            >
              {cargando ? "Verificando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
