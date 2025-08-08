import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServicioApi from "../services/apiServices.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/CreateEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navegador = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [ubicacionesEventos, setUbicacionesEventos] = useState([]);
  const [categoriasEventos, setCategoriasEventos] = useState([]);
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

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const evento = await ServicioApi.obtenerEventoPorId(id);
        setDatosFormulario({
          name: evento.name || "",
          description: evento.description || "",
          start_date: evento.start_date ? evento.start_date.slice(0, 16) : "",
          end_date: evento.end_date ? evento.end_date.slice(0, 16) : "",
          max_assistance: evento.max_assistance || "",
          price: evento.price || "",
          duration_in_minutes: evento.duration_in_minutes || "",
          id_event_category: evento.id_event_category || "",
          id_event_location: evento.id_event_location || "",
        });
        const ubicaciones = await ServicioApi.obtenerUbicacionesEventos();
        setUbicacionesEventos(ubicaciones);
        const categorias = await ServicioApi.obtenerCategoriasEventos();
        setCategoriasEventos(categorias);
      } catch (err) {
        setError("Error al cargar datos del evento:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id]);

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
      if (!datosFormulario.price || parseFloat(datosFormulario.price) < 0) {
        throw new Error("El precio es obligatorio y debe ser mayor o igual a 0");
      }
      const datosEvento = {
        name: datosFormulario.name,
        description: datosFormulario.description,
        start_date: datosFormulario.start_date,
        end_date: datosFormulario.end_date,
        max_assistance: parseInt(datosFormulario.max_assistance),
        price: parseFloat(datosFormulario.price),
        duration_in_minutes: parseInt(datosFormulario.duration_in_minutes),
        id_event_category: parseInt(datosFormulario.id_event_category),
        id_event_location: parseInt(datosFormulario.id_event_location),
      };
      await ServicioApi.actualizarEvento(id, datosEvento);
      setExito(true);
      setTimeout(() => {
        navegador(`/events/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al actualizar el evento");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="create-event-page">
        <div className="container">
          <LoadingSpinner size="large" text="Cargando datos..." />
        </div>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="create-event-page">
        <div className="container">
          <div className="success-card">
            <h2>¡Evento actualizado exitosamente!</h2>
            <p>Los cambios se guardaron correctamente.</p>
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
          <h1>Editar Evento</h1>
          <p>Modificá los datos de tu evento</p>
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
                placeholder="Describe tu evento..."
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
                <label htmlFor="price">Precio *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={datosFormulario.price}
                  onChange={manejarCambio}
                  min="0"
                  step="0.01"
                  className="form-input"
                  required
                  placeholder="Ej: 25.00"
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
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
