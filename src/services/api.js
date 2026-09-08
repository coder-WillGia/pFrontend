import axios from 'axios';
import { useNotificationStore } from '../stores/notificationStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const notificationStore = useNotificationStore();
        let message = 'Ocurrió un error inesperado. Intenta de nuevo.';
        let errors = null;

        if (error.response) {
            const data = error.response.data;
            message = data.message || message;
            errors = data.errors || null;

            switch (error.response.status) {
                case 400:
                    notificationStore.showError(message);
                    break;
                case 404:
                    notificationStore.showError(message || 'Recurso no encontrado.');
                    break;
                case 422:
                    // Handled locally by forms for validation messages, but show a general Toast warning
                    notificationStore.showError(message || 'Los datos proporcionados no son válidos.');
                    break;
                case 500:
                    notificationStore.showError('Error interno del servidor. Intenta de nuevo más tarde.');
                    break;
                default:
                    notificationStore.showError(message);
            }
        } else if (error.request) {
            message = 'No se pudo conectar con el servidor. Verifica tu conexión de red.';
            notificationStore.showError(message);
        } else {
            notificationStore.showError(error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
