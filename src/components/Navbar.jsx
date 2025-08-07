import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-logo">
          <img
            src="/src/assets/logo eventutti sin fondo.png"
            alt="Eventutti"
            className="logo-image"
          />
          <span className="logo-text">Eventutti</span>
        </Link>

        <div className="nav-menu" style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/events" className="nav-link">
                Eventos
              </Link>
              <Link to="/my-events" className="nav-link">
                Mis Eventos
              </Link>
              <Link to="/profile" className="nav-link">
                Perfil
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-link nav-link-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
