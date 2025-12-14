import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (data) => api.post('/login', data),
    register: (data) => api.post('/register', data),
};

export const truckAPI = {
    getAll: () => api.get('/trucks'),
    getById: (id) => api.get(`/trucks/${id}`),
    create: (data) => api.post('/trucks', data),
    update: (id, data) => api.put(`/trucks/${id}`, data),
    delete: (id) => api.delete(`/trucks/${id}`),
};

export const trailerAPI = {
    getAll: () => api.get('/trailers'),
    create: (data) => api.post('/trailers', data),
    update: (id, data) => api.put(`/trailers/${id}`, data),
    delete: (id) => api.delete(`/trailers/${id}`),
};

export const tripAPI = {
    getAll: () => api.get('/trips'),
    getMyTrips: () => api.get('/my-trips'),
    getById: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    updateStatus: (id, data) => api.patch(`/trips/${id}/status`, data),
    delete: (id) => api.delete(`/trips/${id}`),
    downloadPDF: (id) => api.get(`/trips/${id}/pdf`, { responseType: 'blob' }),
};

export const maintenanceAPI = {
    getAll: () => api.get('/maintenances'),
    getByTruck: (truckId) => api.get(`/maintenances/truck/${truckId}`),
    getUpcoming: () => api.get('/maintenances/upcoming'),
    create: (data) => api.post('/maintenances', data),
    update: (id, data) => api.put(`/maintenances/${id}`, data),
    delete: (id) => api.delete(`/maintenances/${id}`),
};

export const reportAPI = {
    getDashboard: () => api.get('/reports/dashboard'),
    getFuel: (params) => api.get('/reports/fuel', { params }),
    getMileage: (params) => api.get('/reports/mileage', { params }),
    getMaintenance: (params) => api.get('/reports/maintenance', { params }),
    getDrivers: () => api.get('/reports/drivers'),
};

export default api;