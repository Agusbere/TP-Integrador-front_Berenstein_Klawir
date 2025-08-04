import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServicioApi from "../services/apiServices.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/CreateEvent.css";

const CrearEvento = () => {
  const navegador = useNavigate();
  const [ubicacionesEventos, setUbicacionesEventos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const [datosFormulario, setDatosFormulario] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    max_assistance: "",
    price: "",
    duration_in_minutes: "",
    id_event_category: "",
    id_event_location: "",
  });

  const categoriasEventos = [
    { id: 1, name: "Conferencia" },
    { id: 2, name: "Concierto" },
    { id: 3, name: "Deportes" },
    { id: 4, name: "Arte y Cultura" },
    { id: 5, name: "Gastronomía" },
    { id: 6, name: "Tecnología" },
    { id: 7, name: "Educación" },
    { id: 8, name: "Entretenimiento" },
  ];

  useEffect(() => {
    const obtenerUbicacionesEventos = async () => {
      try {
        const ubicaciones = await ServicioApi.obtenerUbicacionesEventos();
        setUbicacionesEventos(ubicaciones);
      } catch (err) {
        console.error("Error obteniendo ubicaciones de eventos:", err);
      } finally {
        setCargandoUbicaciones(false);
      }
    };

    obtenerUbicacionesEventos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      if (
        new Date(datosFormulario.end_date) <=
        new Date(datosFormulario.start_date)
      ) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio"
        );
      }

      if (parseInt(datosFormulario.max_assistance) <= 0) {
        throw new Error("La capacidad máxima debe ser mayor a 0");
      }

      if (parseInt(datosFormulario.duration_in_minutes) <= 0) {
        throw new Error("La duración debe ser mayor a 0 minutos");
      }

      const datosEvento = {
        ...datosFormulario,
        max_assistance: parseInt(datosFormulario.max_assistance),
        duration_in_minutes: parseInt(datosFormulario.duration_in_minutes),
        id_event_category: parseInt(datosFormulario.id_event_category),
        id_event_location: parseInt(datosFormulario.id_event_location),
        price: datosFormulario.price ? parseFloat(datosFormulario.price) : null,
      };

      const nuevoEvento = await ServicioApi.crearEvento(datosEvento);
      setExito(true);

      setTimeout(() => {
        navegador(`/events/${nuevoEvento.id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al crear el evento");
    } finally {
      setCargando(false);
    }
  };

  if (cargandoUbicaciones) {
    return (
      <div className="create-event-page">
        <div className="container">
          <LoadingSpinner size="large" text="Cargando formulario..." />
        </div>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="create-event-page">
        <div className="container">
          <div className="success-card">
            <h2>¡Evento creado exitosamente!</h2>
            <p>
              Tu evento ha sido publicado y ya está disponible para
              inscripciones.
            </p>
            <LoadingSpinner size="medium" text="Redirigiendo..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-page">
      <div className="container">
        <div className="create-event-header">
          <h1>Crear Nuevo Evento</h1>
          <p>Comparte tu evento con la comunidad</p>
        </div>

        <form onSubmit={manejarEnvio} className="create-event-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-section">
            <h3>Información Básica</h3>

            <div className="form-group">
              <label htmlFor="name">Nombre del Evento *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={datosFormulario.name}
                onChange={manejarCambio}
                required
                className="form-input"
                placeholder="Ej: Concierto de Rock en Vivo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={datosFormulario.description}
                onChange={manejarCambio}
                required
                className="form-textarea"
                rows="4"
                placeholder="Describe tu evento, qué pueden esperar los asistentes..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_event_category">Categoría *</label>
                <select
                  id="id_event_category"
                  name="id_event_category"
                  value={datosFormulario.id_event_category}
                  onChange={manejarCambio}
                  required
                  className="form-select"
                >
                  <option value="">Selecciona una categoría</option>
                  {categoriasEventos.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_event_location">Ubicación *</label>
                <select
                  id="id_event_location"
                  name="id_event_location"
                  value={datosFormulario.id_event_location}
                  onChange={manejarCambio}
                  required
                  className="form-select"
                >
                  <option value="">Selecciona una ubicación</option>
                  {ubicacionesEventos.map((ubicacion) => (
                    <option key={ubicacion.id} value={ubicacion.id}>
                      {ubicacion.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Fecha y Hora</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Fecha y Hora de Inicio *</label>
                <input
                  type="datetime-local"
                  id="start_date"
                  name="start_date"
                  value={datosFormulario.start_date}
                  onChange={manejarCambio}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">Fecha y Hora de Fin *</label>
                <input
                  type="datetime-local"
                  id="end_date"
                  name="end_date"
                  value={datosFormulario.end_date}
                  onChange={manejarCambio}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="duration_in_minutes">Duración (minutos) *</label>
              <input
                type="number"
                id="duration_in_minutes"
                name="duration_in_minutes"
                value={datosFormulario.duration_in_minutes}
                onChange={manejarCambio}
                required
                min="1"
                className="form-input"
                placeholder="Ej: 120"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Capacidad y Precio</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="max_assistance">Capacidad Máxima *</label>
                <input
                  type="number"
                  id="max_assistance"
                  name="max_assistance"
                  value={datosFormulario.max_assistance}
                  onChange={manejarCambio}
                  required
                  min="1"
                  className="form-input"
                  placeholder="Ej: 100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio (opcional)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={datosFormulario.price}
                  onChange={manejarCambio}
                  min="0"
                  step="0.01"
                  className="form-input"
                  placeholder="Ej: 25.00 (dejar vacío si es gratis)"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navegador("/dashboard")}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="btn btn-primary"
            >
              {cargando ? (
                <LoadingSpinner size="small" text="" />
              ) : (
                "Crear Evento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEvento;
