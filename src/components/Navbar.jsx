import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img
            src="/src/assets/logo eventutti sin fondo.png"
            alt="Eventutti"
            className="logo-image"
          />
          <span className="logo-text">Eventutti</span>
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to="/events" className="nav-link">
            Eventos
          </Link>

          {isAuthenticated ? (
            <div className="nav-user-menu">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/create-event" className="nav-link">
                Crear Evento
              </Link>
              <Link to="/event-locations" className="nav-link">
                Ubicaciones
              </Link>

              <div className="user-dropdown">
                <button className="user-button">
                  <span className="user-avatar">
                    {user?.first_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span className="user-name">
                    {user?.first_name || "Usuario"}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                <div className="dropdown-content">
                  <Link to="/profile" className="dropdown-item">
                    Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-link nav-link-primary">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
