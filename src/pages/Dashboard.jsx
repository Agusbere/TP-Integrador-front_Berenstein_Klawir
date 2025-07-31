import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/apiServices.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import EventCard from '../components/EventCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [userEvents, setUserEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const events = await ApiService.getEvents();
                setAllEvents(events);
                
                setUserEvents(events.slice(0, 3));
                
            } catch (err) {
                setError('Error al cargar el dashboard');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <LoadingSpinner size="large" text="Cargando dashboard..." />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1>¡Hola, {user?.first_name || 'Usuario'}!</h1>
                    <p>Bienvenido a tu dashboard personal</p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon">🎉</div>
                        <div className="stat-content">
                            <h3>{allEvents.length}</h3>
                            <p>Eventos disponibles</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h3>0</h3>
                            <p>Mis inscripciones</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">✨</div>
                        <div className="stat-content">
                            <h3>0</h3>
                            <p>Eventos creados</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <Link to="/create-event" className="action-card create-event">
                        <div className="action-icon">➕</div>
                        <div className="action-content">
                            <h3>Crear Evento</h3>
                            <p>Organiza tu propio evento y invita a otros</p>
                        </div>
                    </Link>
                    
                    <Link to="/events" className="action-card browse-events">
                        <div className="action-icon">🔍</div>
                        <div className="action-content">
                            <h3>Explorar Eventos</h3>
                            <p>Descubre eventos increíbles cerca de ti</p>
                        </div>
                    </Link>
                    
                    <Link to="/profile" className="action-card profile">
                        <div className="action-icon">👤</div>
                        <div className="action-content">
                            <h3>Mi Perfil</h3>
                            <p>Actualiza tu información personal</p>
                        </div>
                    </Link>
                </div>

                {error ? (
                    <div className="error-section">
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-primary"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>Eventos Destacados</h2>
                                <Link to="/events" className="view-all-link">
                                    Ver todos →
                                </Link>
                            </div>
                            
                            {userEvents.length > 0 ? (
                                <div className="events-grid">
                                    {userEvents.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-events">
                                    <p>No hay eventos destacados en este momento.</p>
                                    <Link to="/events" className="btn btn-primary">
                                        Explorar eventos
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="dashboard-section">
                            <h2>Accesos Rápidos</h2>
                            <div className="quick-links">
                                <Link to="/event-locations" className="quick-link">
                                    <span className="quick-link-icon">📍</span>
                                    <span>Gestionar Ubicaciones</span>
                                </Link>
                                <Link to="/events" className="quick-link">
                                    <span className="quick-link-icon">🎪</span>
                                    <span>Todos los Eventos</span>
                                </Link>
                                <Link to="/profile" className="quick-link">
                                    <span className="quick-link-icon">⚙️</span>
                                    <span>Configuración</span>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
