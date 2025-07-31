import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ApiService from '../services/apiServices.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import '../styles/EventDetail.css';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enrollError, setEnrollError] = useState('');
    const [enrollSuccess, setEnrollSuccess] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const eventData = await ApiService.getEventById(id);
                setEvent(eventData);
            } catch (err) {
                setError('Error al cargar el evento');
                console.error('Error fetching event:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setEnrollLoading(true);
        setEnrollError('');
        setEnrollSuccess('');

        try {
            await ApiService.enrollInEvent(id);
            setEnrollSuccess('¡Te has inscrito exitosamente al evento!');
        } catch (err) {
            setEnrollError(err.message || 'Error al inscribirse al evento');
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleUnenroll = async () => {
        setEnrollLoading(true);
        setEnrollError('');
        setEnrollSuccess('');

        try {
            await ApiService.unenrollFromEvent(id);
            setEnrollSuccess('Te has desinscrito del evento exitosamente');
        } catch (err) {
            setEnrollError(err.message || 'Error al desinscribirse del evento');
        } finally {
            setEnrollLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="event-detail-page">
                <div className="container">
                    <LoadingSpinner size="large" text="Cargando evento..." />
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-detail-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Error al cargar el evento</h2>
                        <p>{error || 'El evento no existe'}</p>
                        <button 
                            onClick={() => navigate('/events')} 
                            className="btn btn-primary"
                        >
                            Volver a eventos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatEventDate = (dateString) => {
        try {
            return format(new Date(dateString), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
        } catch {
            return 'Fecha no válida';
        }
    };

    const formatEventTime = (dateString) => {
        try {
            return format(new Date(dateString), 'HH:mm', { locale: es });
        } catch {
            return '';
        }
    };

    return (
        <div className="event-detail-page">
            <div className="container">
                <div className="event-detail">
                    <div className="event-header">
                        <div className="event-category-badge">
                            {event.event_category?.name || 'Sin categoría'}
                        </div>
                        <h1 className="event-title">{event.name}</h1>
                        <div className="event-meta">
                            <div className="meta-item">
                                <span className="meta-label">Fecha:</span>
                                <span>{formatEventDate(event.start_date)}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Hora:</span>
                                <span>{formatEventTime(event.start_date)} - {formatEventTime(event.end_date)}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Ubicación:</span>
                                <span>{event.event_location?.name || 'Ubicación por confirmar'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="event-content">
                        <div className="event-main">
                            <div className="event-description">
                                <h2>Descripción</h2>
                                <p>{event.description}</p>
                            </div>

                            {event.event_location && (
                                <div className="event-location-details">
                                    <h2>Ubicación</h2>
                                    <div className="location-card">
                                        <h3>{event.event_location.name}</h3>
                                        <p>{event.event_location.full_address}</p>
                                        {event.event_location.latitude && event.event_location.longitude && (
                                            <p className="coordinates">
                                                Coordenadas: {event.event_location.latitude}, {event.event_location.longitude}
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
                                    <span className="info-value">{event.max_assistance} personas</span>
                                </div>
                                
                                {event.price && (
                                    <div className="info-item">
                                        <span className="info-label">Precio</span>
                                        <span className="info-value price">${event.price}</span>
                                    </div>
                                )}

                                <div className="info-item">
                                    <span className="info-label">Duración estimada</span>
                                    <span className="info-value">{event.duration_in_minutes} minutos</span>
                                </div>

                                {event.creator_user && (
                                    <div className="info-item">
                                        <span className="info-label">Organizador</span>
                                        <span className="info-value">
                                            {event.creator_user.first_name} {event.creator_user.last_name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="enrollment-section">
                                {enrollError && (
                                    <div className="alert alert-error">
                                        {enrollError}
                                    </div>
                                )}
                                
                                {enrollSuccess && (
                                    <div className="alert alert-success">
                                        {enrollSuccess}
                                    </div>
                                )}

                                {isAuthenticated ? (
                                    <div className="enrollment-actions">
                                        <button 
                                            onClick={handleEnroll}
                                            disabled={enrollLoading}
                                            className="btn btn-primary btn-block"
                                        >
                                            {enrollLoading ? <LoadingSpinner size="small" text="" /> : 'Inscribirse al Evento'}
                                        </button>
                                        <button 
                                            onClick={handleUnenroll}
                                            disabled={enrollLoading}
                                            className="btn btn-secondary btn-block"
                                        >
                                            {enrollLoading ? <LoadingSpinner size="small" text="" /> : 'Desinscribirse'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="login-prompt">
                                        <p>Inicia sesión para inscribirte a este evento</p>
                                        <button 
                                            onClick={() => navigate('/login')}
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
