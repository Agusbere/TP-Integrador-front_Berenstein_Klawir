import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || 'Error en la solicitud';

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }

        return Promise.reject(new Error(message));
    }
);

const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

publicApiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || 'Error en la solicitud';
        return Promise.reject(new Error(message));
    }
);

class ApiService {
    static async login(credentials) {
        return publicApiClient.post('/auth/login', credentials);
    }

    static async register(userData) {
        return publicApiClient.post('/auth/register', userData);
    }

    static async getEvents(params = {}) {
        return apiClient.get('/event', { params });
    }

    static async getEventById(id) {
        return apiClient.get(`/event/${id}`);
    }

    static async searchEvents(searchParams) {
        const validParams = {};

        if (searchParams.name) validParams.name = searchParams.name;
        if (searchParams.startdate) validParams.startdate = searchParams.startdate;
        if (searchParams.tag) validParams.tag = searchParams.tag;

        return apiClient.get('/event/search', { params: validParams });
    }

    static async createEvent(eventData) {
        return apiClient.post('/event', eventData);
    }

    static async updateEvent(id, eventData) {
        return apiClient.put(`/event/${id}`, eventData);
    }

    static async deleteEvent(id) {
        return apiClient.delete(`/event/${id}`);
    }

    static async getEventCategories() {
        return publicApiClient.get('/event/categories');
    }

    static async enrollInEvent(eventId) {
        return apiClient.post(`/event/${eventId}/enrollment`);
    }

    static async unenrollFromEvent(eventId) {
        return apiClient.delete(`/event/${eventId}/enrollment`);
    }

    static async getEventLocations() {
        return apiClient.get('/event-location');
    }

    static async getEventLocationById(id) {
        return apiClient.get(`/event-location/${id}`);
    }

    static async createEventLocation(locationData) {
        return apiClient.post('/event-location', locationData);
    }

    static async updateEventLocation(id, locationData) {
        return apiClient.put(`/event-location/${id}`, locationData);
    }

    static async deleteEventLocation(id) {
        return apiClient.delete(`/event-location/${id}`);
    }

    static async getUserProfile() {
        return apiClient.get('/user/profile');
    }

    static async getAllUsers() {
        return apiClient.get('/user');
    }

    static async updateUserProfile(userData) {
        return apiClient.put('/user/profile', userData);
    }

    static async deleteUserProfile() {
        return apiClient.delete('/user/profile');
    }
}

export default ApiService;