import { useState, useEffect } from 'react';
import ApiService from '../services/apiServices.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import '../styles/EventLocations.css';

const EventLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        full_address: '',
        max_capacity: '',
        latitude: '',
        longitude: ''
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const locationsData = await ApiService.getEventLocations();
            setLocations(locationsData);
        } catch (err) {
            setError('Error al cargar las ubicaciones');
            console.error('Error fetching locations:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            full_address: '',
            max_capacity: '',
            latitude: '',
            longitude: ''
        });
        setEditing(null);
        setShowForm(false);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');

        try {
            const locationData = {
                ...formData,
                max_capacity: parseInt(formData.max_capacity),
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null
            };

            if (editing) {
                await ApiService.updateEventLocation(editing.id, locationData);
            } else {
                await ApiService.createEventLocation(locationData);
            }

            resetForm();
            fetchLocations();
        } catch (err) {
            setError(err.message || 'Error al guardar la ubicación');
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (location) => {
        setFormData({
            name: location.name,
            full_address: location.full_address,
            max_capacity: location.max_capacity.toString(),
            latitude: location.latitude?.toString() || '',
            longitude: location.longitude?.toString() || ''
        });
        setEditing(location);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
            try {
                await ApiService.deleteEventLocation(id);
                fetchLocations();
            } catch (err) {
                setError(err.message || 'Error al eliminar la ubicación');
            }
        }
    };

    const startCreating = () => {
        resetForm();
        setShowForm(true);
    };

    if (loading) {
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
                        onClick={startCreating}
                        className="btn btn-primary"
                        disabled={showForm}
                    >
                        + Nueva Ubicación
                    </button>
                </div>

                {showForm && (
                    <div className="location-form-card">
                        <div className="form-header">
                            <h3>{editing ? 'Editar Ubicación' : 'Nueva Ubicación'}</h3>
                            <button
                                onClick={resetForm}
                                className="btn-close"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="location-form">
                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="name">Nombre de la Ubicación *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
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
                                    value={formData.full_address}
                                    onChange={handleChange}
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
                                        value={formData.max_capacity}
                                        onChange={handleChange}
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
                                        value={formData.latitude}
                                        onChange={handleChange}
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
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        step="any"
                                        className="form-input"
                                        placeholder="Ej: -58.3816"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="btn btn-primary"
                                >
                                    {creating ? <LoadingSpinner size="small" text="" /> : (editing ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="locations-list">
                    {locations.length > 0 ? (
                        <div className="locations-grid">
                            {locations.map(location => (
                                <div key={location.id} className="location-card">
                                    <div className="location-header">
                                        <h3 className="location-name">{location.name}</h3>
                                        <div className="location-actions">
                                            <button
                                                onClick={() => handleEdit(location)}
                                                className="btn-action btn-edit"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(location.id)}
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
                                            <span className="detail-text">{location.full_address}</span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-icon">👥</span>
                                            <span className="detail-text">
                                                Capacidad: {location.max_capacity} personas
                                            </span>
                                        </div>

                                        {location.latitude && location.longitude && (
                                            <div className="detail-item">
                                                <span className="detail-icon">🗺️</span>
                                                <span className="detail-text">
                                                    {location.latitude}, {location.longitude}
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
                            <p>Crea tu primera ubicación para comenzar a organizar eventos.</p>
                            <button
                                onClick={startCreating}
                                className="btn btn-primary"
                            >
                                Crear Primera Ubicación
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventLocations;
