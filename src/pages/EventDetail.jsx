import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ServicioApi from "../services/apiServices.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const navegador = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoInscripcion, setCargandoInscripcion] = useState(false);
  const [error, setError] = useState(null);
  const [errorInscripcion, setErrorInscripcion] = useState("");
  const [exitoInscripcion, setExitoInscripcion] = useState("");
  const [estaInscrito, setEstaInscrito] = useState(false);

  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        setCargando(true);
        const datosEvento = await ServicioApi.obtenerEventoPorId(id);
        setEvento(datosEvento);
        if (isAuthenticated && user && user.id) {
          try {
            const inscrito = await ServicioApi.verificarInscripcionEvento(id, user.id);
            setEstaInscrito(Boolean(inscrito));
          } catch (err) {
            console.error("Error verificando inscripción:", err);
            setEstaInscrito(false);
          }
        }
      } catch (err) {
        setError("Error al cargar el evento");
        console.error("Error obteniendo evento:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerEvento();
  }, [id, isAuthenticated, user?.id]);

  const manejarInscripcion = async () => {
    if (!isAuthenticated) {
      navegador("/login");
      return;
    }

    setCargandoInscripcion(true);
    setErrorInscripcion("");
    setExitoInscripcion("");

    try {
      await ServicioApi.inscribirseEnEvento(id);
      setExitoInscripcion("¡Te has inscrito exitosamente al evento!");
        try {
          const inscrito = await ServicioApi.verificarInscripcionEvento(id, user.id);
          setEstaInscrito(Boolean(inscrito));
        } catch (err) {
          console.error("Error verificando inscripción:", err);
          setEstaInscrito(true);
        }
    } catch (err) {
      setErrorInscripcion(err.message || "Error al inscribirse al evento");
    } finally {
      setCargandoInscripcion(false);
    }
  };

  const manejarDesinscripcion = async () => {
    setCargandoInscripcion(true);
    setErrorInscripcion("");
    setExitoInscripcion("");

    try {
      await ServicioApi.desinscribirseDeEvento(id);
        setExitoInscripcion("Te has desinscrito del evento exitosamente");
        try {
          const inscrito = await ServicioApi.verificarInscripcionEvento(id, user.id);
          setEstaInscrito(Boolean(inscrito));
        } catch (err) {
          console.error("Error verificando desinscripción:", err);
          setEstaInscrito(false);
        }
    } catch (err) {
      setErrorInscripcion(err.message || "Error al desinscribirse del evento");
    } finally {
      setCargandoInscripcion(false);
    }
  };

  if (cargando) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <LoadingSpinner size="large" text="Cargando evento..." />
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Error al cargar el evento</h2>
            <p>{error || "El evento no existe"}</p>
            <button
              onClick={() => navegador("/events")}
              className="btn btn-primary"
            >
              Volver a eventos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatearFechaEvento = (fechaCadena) => {
    try {
      return format(new Date(fechaCadena), "EEEE, dd 'de' MMMM 'de' yyyy", {
        locale: es,
      });
    } catch {
      return "Fecha no válida";
    }
  };

  const formatearHoraEvento = (fechaCadena) => {
    try {
      return format(new Date(fechaCadena), "HH:mm", { locale: es });
    } catch {
      return "";
    }
  };

  return (
    <div className="event-detail-page">
      <div className="container">
        <div className="event-detail">
          <div className="event-header">
            <div className="event-category-badge">
              {evento.event_category_name || "Sin categoría"}
            </div>
            <h1 className="event-title">{evento.name}</h1>
            <div className="event-meta">
              <div className="meta-item">
                <span className="meta-label">Fecha:</span>
                <span>{formatearFechaEvento(evento.start_date)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Hora:</span>
                <span>
                  {formatearHoraEvento(evento.start_date)}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Ubicación:</span>
                <span>
                  {evento.province_name}, {evento.event_location_name || "Ubicación por confirmar"}
                </span>
              </div>
            </div>
          </div>

          <div className="event-content">
            <div className="event-main">
              <div className="event-description">
                <h2>Descripción</h2>
                <p>{evento.description}</p>
              </div>

              {evento.event_location && (
                <div className="event-location-details">
                  <h2>Ubicación</h2>
                  <div className="location-card">
                    <h3>{evento.event_location.name}</h3>
                    <p>{evento.event_location.full_address}</p>
                    {evento.event_location.latitude &&
                      evento.event_location.longitude && (
                        <p className="coordinates">
                          Coordenadas: {evento.event_location.latitude},{" "}
                          {evento.event_location.longitude}
                        </p>
                      )}
                  </div>
                </div>
              )}
            </div>

            <div className="event-sidebar">
              <div className="event-card-info">
                <div className="info-item">
                  <span className="info-label">Capacidad máxima</span>
                  <span className="info-value">
                    {evento.max_assistance} personas
                  </span>
                </div>

                {evento.price && (
                  <div className="info-item">
                    <span className="info-label">Precio</span>
                    <span className="info-value price">${evento.price}</span>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">Duración estimada</span>
                  <span className="info-value">
                    {evento.duration_in_minutes} minutos
                  </span>
                </div>

                {evento.creator_user && (
                  <div className="info-item">
                    <span className="info-label">Organizador</span>
                    <span className="info-value">
                      {evento.creator_user.first_name}{" "}
                      {evento.creator_user.last_name}
                    </span>
                  </div>
                )}
              </div>

              <div className="enrollment-section">
                {errorInscripcion && (
                  <div className="alert alert-error">{errorInscripcion}</div>
                )}

                {exitoInscripcion && (
                  <div className="alert alert-success">{exitoInscripcion}</div>
                )}

                {isAuthenticated ? (
                  <div className="enrollment-actions">
                    {evento.creator_user?.id === user?.id ? (
                      <div className="creator-notice">
                        <p>No puedes inscribirte a tu propio evento</p>
                      </div>
                    ) : estaInscrito ? (
                      <button
                        onClick={manejarInscripcion}
                        disabled={cargandoInscripcion}
                        className="btn btn-primary btn-block"
                      >
                        {cargandoInscripcion ? (
                          <LoadingSpinner size="small" text="" />
                        ) : (
                          "Inscribirse al Evento"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={manejarDesinscripcion}
                        disabled={cargandoInscripcion}
                        className="btn btn-secondary btn-block"
                      >
                        {cargandoInscripcion ? (
                          <LoadingSpinner size="small" text="" />
                        ) : (
                          "Desinscribirse"
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="login-prompt">
                    <p>Inicia sesión para inscribirte a este evento</p>
                    <button
                      onClick={() => navegador("/login")}
                      className="btn btn-primary btn-block"
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
