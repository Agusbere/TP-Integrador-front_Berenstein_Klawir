import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const EventCard = ({ event, showActions = false, onEdit, onDelete }) => {
  console.log("Datos del evento en EventCard:", event);
  console.log("Ubicación recibida:", event.province_name, event.event_location?.name);

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: es });
    } catch {
      return "";
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-date">
          <span className="date-day">
            {format(new Date(event.start_date), "dd")}
          </span>
          <span className="date-month">
            {format(new Date(event.start_date), "MMM", { locale: es })}
          </span>
        </div>
        <div className="event-category">
          {event.event_category?.name || "Sin categoría"}
        </div>
      </div>

      <div className="event-card-body">
        <h3 className="event-title">{event.name}</h3>
        <p className="event-description">
          {event.description?.length > 120
            ? `${event.description.substring(0, 120)}...`
            : event.description}
        </p>

        <div className="event-details">
          <div className="event-detail-item">
            <span className="detail-text">
              Ubicación: {event.province_name}, {event.event_location?.name || "Por confirmar"}
            </span>
          </div>

          <div className="event-detail-item">
            <span className="detail-text">
              Hora: {formatTime(event.start_date)} Duración: {event.duration_in_minutes} min
            </span>
          </div>

          <div className="event-detail-item">
            <span className="detail-text">
              Máximo: {event.max_assistance} personas
            </span>
          </div>

          {event.price && (
            <div className="event-detail-item">
              <span className="detail-text">Precio: ${event.price}</span>
            </div>
          )}
        </div>
      </div>

      <div className="event-card-footer">
        <Link to={`/events/${event.id}`} className="btn btn-primary btn-block">
          Ver Detalles
        </Link>
        {showActions && (
          <div className="event-card-actions">
            <button onClick={onEdit} className="btn btn-secondary">
              Editar
            </button>
            <button onClick={onDelete} className="btn btn-danger">
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
