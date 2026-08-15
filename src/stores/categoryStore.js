import { defineStore } from 'pinia';
import categoryService from '../services/categoryService';
import { useNotificationStore } from './notificationStore';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        meta: null,
        loading: false,
        error: null,
        successMessage: null
    }),
    actions: {
        async fetchCategories(perPage = null, page = 1) {
            this.loading = true;
            this.error = null;
            try {
                const response = await categoryService.getCategories(perPage, page);
                if (response.success) {
                    if (perPage !== null) {
                        this.categories = response.data.items;
                        this.meta = response.data.meta;
                    } else {
                        this.categories = response.data;
                        this.meta = null;
                    }
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al obtener categorías';
            } finally {
                this.loading = false;
            }
        },
        async createCategory(name) {
            this.loading = true;
            this.error = null;
            const notificationStore = useNotificationStore();
            try {
                const response = await categoryService.createCategory({ name });
                if (response.success) {
                    this.categories.push(response.data);
                    notificationStore.showSuccess(response.message || 'Categoría creada correctamente');
                    return response.data;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al crear categoría';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async updateCategory(id, name) {
            this.loading = true;
            this.error = null;
            const notificationStore = useNotificationStore();
            try {
                const response = await categoryService.updateCategory(id, { name });
                if (response.success) {
                    const index = this.categories.findIndex(c => c.id === id);
                    if (index !== -1) {
                        this.categories[index] = response.data;
                    }
                    notificationStore.showSuccess(response.message || 'Categoría actualizada correctamente');
                    return response.data;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al actualizar categoría';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async deleteCategory(id) {
            this.loading = true;
            this.error = null;
            const notificationStore = useNotificationStore();
            try {
                const response = await categoryService.deleteCategory(id);
                if (response.success) {
                    this.categories = this.categories.filter(c => c.id !== id);
                    notificationStore.showSuccess(response.message || 'Categoría eliminada correctamente');
                    return true;
                }
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al eliminar categoría';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
