import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import ServicioApi from "../services/apiServices.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/Profile.css";

const Perfil = () => {
  const { user, logout } = useAuth();
  const [datosFormulario, setDatosFormulario] = useState({
    first_name: "",
    last_name: "",
    username: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] =
    useState(false);

  useEffect(() => {
    if (user) {
      setDatosFormulario({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const manejarCambio = (e) => {
    setDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value,
    });
    setError("");
    setExito("");
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setExito("");

    try {
      await ServicioApi.actualizarPerfilUsuario(datosFormulario);
      setExito("Perfil actualizado exitosamente");
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminarCuenta = async () => {
    try {
      await ServicioApi.eliminarPerfilUsuario();
      logout();
    } catch (err) {
      setError(err.message || "Error al eliminar la cuenta");
      setMostrarConfirmacionEliminar(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p>Administra tu información personal</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user?.first_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h2>
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="profile-username">@{user?.username}</p>
            </div>

            <form onSubmit={manejarEnvio} className="profile-form">
              {error && <div className="alert alert-error">{error}</div>}

              {exito && <div className="alert alert-success">{exito}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">Nombre</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={datosFormulario.first_name}
                    onChange={manejarCambio}
                    required
                    className="form-input"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Apellido</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={datosFormulario.last_name}
                    onChange={manejarCambio}
                    required
                    className="form-input"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={datosFormulario.username}
                  onChange={manejarCambio}
                  required
                  className="form-input"
                  placeholder="Tu nombre de usuario"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={cargando}
                  className="btn btn-primary"
                >
                  {cargando ? (
                    <LoadingSpinner size="small" text="" />
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="profile-stats">
            <h3>Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Eventos creados</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Inscripciones</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Ubicaciones creadas</span>
              </div>
            </div>
          </div>

          <div className="danger-zone">
            <h3>Zona de Peligro</h3>
            <p>
              Esta acción no se puede deshacer. Todos tus datos serán eliminados
              permanentemente.
            </p>

            {!mostrarConfirmacionEliminar ? (
              <button
                onClick={() => setMostrarConfirmacionEliminar(true)}
                className="btn btn-danger"
              >
                Eliminar Cuenta
              </button>
            ) : (
              <div className="delete-confirm">
                <p>
                  <strong>¿Estás seguro que quieres eliminar tu cuenta?</strong>
                </p>
                <div className="confirm-actions">
                  <button
                    onClick={() => setMostrarConfirmacionEliminar(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={manejarEliminarCuenta}
                    className="btn btn-danger"
                  >
                    Sí, eliminar mi cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
