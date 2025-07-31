import { useState, useEffect } from 'react';
import ApiService from '../services/apiServices.jsx';
import EventCard from '../components/EventCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import '../styles/Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const eventsData = await ApiService.getEvents();
                setEvents(eventsData);
                setFilteredEvents(eventsData);
            } catch (err) {
                setError('Error al cargar los eventos');
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const filtered = events.filter(event =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.event_category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.event_location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [searchTerm, events]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="events-page">
                <div className="container">
                    <LoadingSpinner size="large" text="Cargando eventos..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="events-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Error al cargar eventos</h2>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="events-page">
            <div className="container">
                <div className="events-header">
                    <h1>Todos los Eventos</h1>
                    <p>Descubre eventos increíbles cerca de ti</p>
                </div>

                <div className="events-filters">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar eventos..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                <div className="events-results">
                    <div className="results-info">
                        <span className="results-count">
                            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {filteredEvents.length > 0 ? (
                        <div className="events-grid">
                            {filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-events-found">
                            {searchTerm ? (
                                <>
                                    <h3>No se encontraron eventos</h3>
                                    <p>No hay eventos que coincidan con "{searchTerm}"</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="btn btn-secondary"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>No hay eventos disponibles</h3>
                                    <p>No hay eventos publicados en este momento.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;
