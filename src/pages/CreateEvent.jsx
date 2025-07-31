import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiServices.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import '../styles/CreateEvent.css';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [eventLocations, setEventLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        max_assistance: '',
        price: '',
        duration_in_minutes: '',
        id_event_category: '',
        id_event_location: ''
    });

    const eventCategories = [
        { id: 1, name: 'Conferencia' },
        { id: 2, name: 'Concierto' },
        { id: 3, name: 'Deportes' },
        { id: 4, name: 'Arte y Cultura' },
        { id: 5, name: 'Gastronomía' },
        { id: 6, name: 'Tecnología' },
        { id: 7, name: 'Educación' },
        { id: 8, name: 'Entretenimiento' }
    ];

    useEffect(() => {
        const fetchEventLocations = async () => {
            try {
                const locations = await ApiService.getEventLocations();
                setEventLocations(locations);
            } catch (err) {
                console.error('Error fetching event locations:', err);
            } finally {
                setLocationsLoading(false);
            }
        };

        fetchEventLocations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (new Date(formData.end_date) <= new Date(formData.start_date)) {
                throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
            }

            if (parseInt(formData.max_assistance) <= 0) {
                throw new Error('La capacidad máxima debe ser mayor a 0');
            }

            if (parseInt(formData.duration_in_minutes) <= 0) {
                throw new Error('La duración debe ser mayor a 0 minutos');
            }

            const eventData = {
                ...formData,
                max_assistance: parseInt(formData.max_assistance),
                duration_in_minutes: parseInt(formData.duration_in_minutes),
                id_event_category: parseInt(formData.id_event_category),
                id_event_location: parseInt(formData.id_event_location),
                price: formData.price ? parseFloat(formData.price) : null
            };

            const newEvent = await ApiService.createEvent(eventData);
            setSuccess(true);
            
            setTimeout(() => {
                navigate(`/events/${newEvent.id}`);
            }, 2000);

        } catch (err) {
            setError(err.message || 'Error al crear el evento');
        } finally {
            setLoading(false);
        }
    };

    if (locationsLoading) {
        return (
            <div className="create-event-page">
                <div className="container">
                    <LoadingSpinner size="large" text="Cargando formulario..." />
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="create-event-page">
                <div className="container">
                    <div className="success-card">
                        <h2>¡Evento creado exitosamente!</h2>
                        <p>Tu evento ha sido publicado y ya está disponible para inscripciones.</p>
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

                <form onSubmit={handleSubmit} className="create-event-form">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <div className="form-section">
                        <h3>Información Básica</h3>
                        
                        <div className="form-group">
                            <label htmlFor="name">Nombre del Evento *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
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
                                value={formData.description}
                                onChange={handleChange}
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
                                    value={formData.id_event_category}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {eventCategories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="id_event_location">Ubicación *</label>
                                <select
                                    id="id_event_location"
                                    name="id_event_location"
                                    value={formData.id_event_location}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Selecciona una ubicación</option>
                                    {eventLocations.map(location => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
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
                                    value={formData.start_date}
                                    onChange={handleChange}
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
                                    value={formData.end_date}
                                    onChange={handleChange}
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
                                value={formData.duration_in_minutes}
                                onChange={handleChange}
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
                                    value={formData.max_assistance}
                                    onChange={handleChange}
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
                                    value={formData.price}
                                    onChange={handleChange}
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
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? <LoadingSpinner size="small" text="" /> : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
