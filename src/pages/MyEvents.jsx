import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServicioApi from "../services/apiServices.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import EventCard from "../components/EventCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/Events.css";

const MyEvents = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver tus eventos");
      setCargando(false);
      return;
    }

    const obtenerMisEventos = async () => {
      try {
        setCargando(true);
        const misEventos = await ServicioApi.obtenerMisEventos();
        setEventos(misEventos);
      } catch (err) {
        setError("Error al cargar tus eventos");
        console.error("Error obteniendo mis eventos:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerMisEventos();
  }, [isAuthenticated]);

  const eliminarEvento = async (idEvento) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      return;
    }

    try {
      await ServicioApi.eliminarEvento(idEvento);
      setEventos(eventos.filter(evento => evento.id !== idEvento));
    } catch (err) {
      setError("Error al eliminar el evento");
      console.error("Error eliminando evento:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="error-section">
            <h2>Acceso Denegado</h2>
            <p>Debes iniciar sesión para ver tus eventos</p>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="events-page">
        <div className="container">
          <LoadingSpinner size="large" text="Cargando tus eventos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <div className="header-content">
            <h1>Mis Eventos</h1>
            <p>Gestiona los eventos que has creado</p>
          </div>
          <Link to="/create-event" className="btn btn-primary">
            Crear Nuevo Evento
          </Link>
        </div>

        {error && (
          <div className="error-alert">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
            >
              Reintentar
            </button>
          </div>
        )}

        {eventos.length > 0 ? (
          <div className="events-grid">
            {eventos.map((evento) => (
              <EventCard key={evento.id} event={evento} showActions={true} onEdit={() => navigate(`/edit-event/${evento.id}`)} onDelete={() => eliminarEvento(evento.id)} />
            ))}
          </div>
        ) : (
          <div className="no-events">
            <div className="no-events-content">
              <h2>No tienes eventos creados</h2>
              <p>Comienza creando tu primer evento</p>
              <Link to="/create-event" className="btn btn-primary">
                Crear Mi Primer Evento
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents; 