import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3003');

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const endpointsApi = {
    list: () => api.get('/endpoints').then(res => res.data),
    create: (data: { url: string; secret: string; label?: string }) => api.post('/endpoints', data).then(res => res.data),
};

export const eventsApi = {
    send: (payload: any) => api.post('/events', { payload }).then(res => res.data),
};

export const deliveriesApi = {
    list: (params: { page?: number; limit?: number; status?: string }) =>
        api.get('/deliveries', { params }).then(res => res.data),
    retry: (id: string) => api.post(`/deliveries/${id}/retry`).then(res => res.data),
};

export default api;
