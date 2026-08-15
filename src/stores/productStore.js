import { defineStore } from 'pinia';
import productService from '../services/productService';
import { useNotificationStore } from './notificationStore';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        meta: null,
        currentProduct: null,
        loading: false,
        error: null,
        successMessage: null
    }),
    actions: {
        async fetchProducts(perPage = null, page = 1) {
            this.loading = true;
            this.error = null;
            try {
                const response = await productService.getProducts(perPage, page);
                if (response.success) {
                    if (perPage !== null) {
                        this.products = response.data.items;
                        this.meta = response.data.meta;
                    } else {
                        this.products = response.data;
                        this.meta = null;
                    }
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al obtener productos';
            } finally {
                this.loading = false;
            }
        },
        async fetchProduct(id) {
            this.loading = true;
            this.error = null;
            this.currentProduct = null;
            try {
                const response = await productService.getProduct(id);
                if (response.success) {
                    this.currentProduct = response.data;
                    return response.data;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al obtener el producto';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async createProduct(data) {
            this.loading = true;
            this.error = null;
            const notificationStore = useNotificationStore();
            try {
                const response = await productService.createProduct(data);
                if (response.success) {
                    this.products.push(response.data);
                    notificationStore.showSuccess(response.message || 'Producto creado correctamente');
                    return response.data;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al crear producto';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async updateProduct(id, data) {
            this.loading = true;
            this.error = null;
            const notificationStore = useNotificationStore();
            try {
                const response = await productService.updateProduct(id, data);
                if (response.success) {
                    const index = this.products.findIndex(p => p.id === id);
                    if (index !== -1) {
                        this.products[index] = response.data;
                    }
                    notificationStore.showSuccess(response.message || 'Producto actualizado correctamente');
                    return response.data;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al actualizar producto';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async deleteProduct(id) {
            this.loading = true;
            this.error = null;
            const notificationStore = useNotificationStore();
            try {
                const response = await productService.deleteProduct(id);
                if (response.success) {
                    this.products = this.products.filter(p => p.id !== id);
                    notificationStore.showSuccess(response.message || 'Producto eliminado correctamente');
                    return true;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al eliminar producto';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
