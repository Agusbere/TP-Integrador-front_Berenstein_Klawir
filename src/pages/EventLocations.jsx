import { useState, useEffect } from "react";
import ServicioApi from "../services/apiServices.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "../styles/EventLocations.css";

const UbicacionesEventos = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [datosFormulario, setDatosFormulario] = useState({
    name: "",
    full_address: "",
    max_capacity: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    obtenerUbicaciones();
  }, []);

  const obtenerUbicaciones = async () => {
    try {
      setCargando(true);
      const datosUbicaciones = await ServicioApi.obtenerUbicacionesEventos();
      setUbicaciones(datosUbicaciones);
    } catch (err) {
      setError("Error al cargar las ubicaciones");
      console.error("Error fetching locations:", err);
    } finally {
      setCargando(false);
    }
  };

  const reiniciarFormulario = () => {
    setDatosFormulario({
      name: "",
      full_address: "",
      max_capacity: "",
      latitude: "",
      longitude: "",
    });
    setEditando(null);
    setMostrarFormulario(false);
    setError("");
  };

  const manejarCambio = (e) => {
    setDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCreando(true);
    setError("");

    try {
      const datosUbicacion = {
        ...datosFormulario,
        max_capacity: parseInt(datosFormulario.max_capacity),
        latitude: datosFormulario.latitude
          ? parseFloat(datosFormulario.latitude)
          : null,
        longitude: datosFormulario.longitude
          ? parseFloat(datosFormulario.longitude)
          : null,
      };

      if (editando) {
        await ServicioApi.actualizarUbicacionEvento(
          editando.id,
          datosUbicacion
        );
      } else {
        await ServicioApi.crearUbicacionEvento(datosUbicacion);
      }

      reiniciarFormulario();
      obtenerUbicaciones();
    } catch (err) {
      setError(err.message || "Error al guardar la ubicación");
    } finally {
      setCreando(false);
    }
  };

  const manejarEditar = (ubicacion) => {
    setDatosFormulario({
      name: ubicacion.name,
      full_address: ubicacion.full_address,
      max_capacity: ubicacion.max_capacity.toString(),
      latitude: ubicacion.latitude?.toString() || "",
      longitude: ubicacion.longitude?.toString() || "",
    });
    setEditando(ubicacion);
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta ubicación?")
    ) {
      try {
        await ServicioApi.eliminarUbicacionEvento(id);
        obtenerUbicaciones();
      } catch (err) {
        setError(err.message || "Error al eliminar la ubicación");
      }
    }
  };

  const comenzarCreacion = () => {
    reiniciarFormulario();
    setMostrarFormulario(true);
  };

  if (cargando) {
    return (
      <div className="locations-page">
        <div className="container">
          <LoadingSpinner size="large" text="Cargando ubicaciones..." />
        </div>
      </div>
    );
  }

  return (
    <div className="locations-page">
      <div className="container">
        <div className="locations-header">
          <h1>Gestión de Ubicaciones</h1>
          <p>Administra las ubicaciones donde se realizan los eventos</p>
        </div>

        <div className="locations-actions">
          <button
            onClick={comenzarCreacion}
            className="btn btn-primary"
            disabled={mostrarFormulario}
          >
            + Nueva Ubicación
          </button>
        </div>

        {mostrarFormulario && (
          <div className="location-form-card">
            <div className="form-header">
              <h3>{editando ? "Editar Ubicación" : "Nueva Ubicación"}</h3>
              <button
                onClick={reiniciarFormulario}
                className="btn-close"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={manejarEnvio} className="location-form">
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="name">Nombre de la Ubicación *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={datosFormulario.name}
                  onChange={manejarCambio}
                  required
                  className="form-input"
                  placeholder="Ej: Teatro Municipal"
                />
              </div>

              <div className="form-group">
                <label htmlFor="full_address">Dirección Completa *</label>
                <input
                  type="text"
                  id="full_address"
                  name="full_address"
                  value={datosFormulario.full_address}
                  onChange={manejarCambio}
                  required
                  className="form-input"
                  placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="max_capacity">Capacidad Máxima *</label>
                  <input
                    type="number"
                    id="max_capacity"
                    name="max_capacity"
                    value={datosFormulario.max_capacity}
                    onChange={manejarCambio}
                    required
                    min="1"
                    className="form-input"
                    placeholder="Ej: 500"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="latitude">Latitud (opcional)</label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={datosFormulario.latitude}
                    onChange={manejarCambio}
                    step="any"
                    className="form-input"
                    placeholder="Ej: -34.6037"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude">Longitud (opcional)</label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={datosFormulario.longitude}
                    onChange={manejarCambio}
                    step="any"
                    className="form-input"
                    placeholder="Ej: -58.3816"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={reiniciarFormulario}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creando}
                  className="btn btn-primary"
                >
                  {creando ? (
                    <LoadingSpinner size="small" text="" />
                  ) : editando ? (
                    "Actualizar"
                  ) : (
                    "Crear"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="locations-list">
          {ubicaciones.length > 0 ? (
            <div className="locations-grid">
              {ubicaciones.map((ubicacion) => (
                <div key={ubicacion.id} className="location-card">
                  <div className="location-header">
                    <h3 className="location-name">{ubicacion.name}</h3>
                    <div className="location-actions">
                      <button
                        onClick={() => manejarEditar(ubicacion)}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => manejarEliminar(ubicacion.id)}
                        className="btn-action btn-delete"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="location-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">
                        {ubicacion.full_address}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">
                        Capacidad: {ubicacion.max_capacity} personas
                      </span>
                    </div>

                    {ubicacion.latitude && ubicacion.longitude && (
                      <div className="detail-item">
                        <span className="detail-icon">🗺️</span>
                        <span className="detail-text">
                          {ubicacion.latitude}, {ubicacion.longitude}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-locations">
              <h3>No hay ubicaciones registradas</h3>
              <p>
                Crea tu primera ubicación para comenzar a organizar eventos.
              </p>
              <button onClick={comenzarCreacion} className="btn btn-primary">
                Crear Primera Ubicación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UbicacionesEventos;
