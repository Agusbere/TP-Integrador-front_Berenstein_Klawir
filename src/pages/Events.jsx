import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServicioApi from "../services/apiServices.jsx";
import EventCard from "../components/EventCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import "../styles/Events.css";

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        setCargando(true);
        if (isAuthenticated) {
          const datosEventos = await ServicioApi.obtenerTodosLosEventos();
          setEventos(datosEventos);
          setEventosFiltrados(datosEventos);
        } else {
          const datosEventos = await ServicioApi.obtenerEventos({ limit: 10 });
          setEventos(datosEventos);
          setEventosFiltrados(datosEventos);
        }
      } catch (err) {
        setError("Error al cargar los eventos");
        console.error("Error obteniendo eventos:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerEventos();
  }, [isAuthenticated]);

  useEffect(() => {
    const filtrados = eventos.filter(
      (evento) =>
        evento.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        evento.description
          ?.toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        evento.event_category?.name
          ?.toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        evento.event_location?.name
          ?.toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
    );
    setEventosFiltrados(filtrados);
  }, [terminoBusqueda, eventos]);

  const manejarBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  if (cargando) {
    return (
      <div className="events-page">
        <div className="container">
          <LoadingSpinner size="large" text="Cargando eventos..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="error-state">
            <h2>Error al cargar eventos</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <h1>{isAuthenticated ? "Todos los Eventos" : "Eventos Destacados"}</h1>
          <p>{isAuthenticated ? "Explora todos los eventos disponibles en la plataforma" : "Descubre los eventos más populares del momento"}</p>
        </div>

        {isAuthenticated && (
          <div className="events-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        )}

        <div className="events-results">
          <div className="results-info">
            <span className="results-count">
              {eventosFiltrados.length} evento
              {eventosFiltrados.length !== 1 ? "s" : ""} encontrado
              {eventosFiltrados.length !== 1 ? "s" : ""}
            </span>
          </div>

                     {eventosFiltrados.length > 0 ? (
             <>
               <div className="events-grid">
                 {eventosFiltrados.map((evento) => (
                   <EventCard key={evento.id} event={evento} />
                 ))}
               </div>
               {!isAuthenticated && (
                 <div className="auth-prompt">
                   <h3>¿Quieres ver todos los eventos?</h3>
                   <p>Regístrate o inicia sesión para acceder a todos los eventos disponibles</p>
                   <div className="auth-actions">
                     <Link to="/register" className="btn btn-primary">
                       Registrarse
                     </Link>
                     <Link to="/login" className="btn btn-secondary">
                       Iniciar Sesión
                     </Link>
                   </div>
                 </div>
               )}
             </>
           ) : (
            <div className="no-events-found">
              {terminoBusqueda ? (
                <>
                  <h3>No se encontraron eventos</h3>
                  <p>No hay eventos que coincidan con "{terminoBusqueda}"</p>
                  <button
                    onClick={() => setTerminoBusqueda("")}
                    className="btn btn-secondary"
                  >
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <h3>No hay eventos disponibles</h3>
                  <p>No hay eventos publicados en este momento.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
