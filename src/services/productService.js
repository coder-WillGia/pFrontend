import api from './api';

export default {
    async getProducts(perPage = null, page = 1) {
        const url = perPage ? `/products?per_page=${perPage}&page=${page}` : '/products';
        const response = await api.get(url);
        return response.data;
    },
    async getProduct(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    async createProduct(data) {
        const response = await api.post('/products', data);
        return response.data;
    },
    async updateProduct(id, data) {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },
    async deleteProduct(id) {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};
