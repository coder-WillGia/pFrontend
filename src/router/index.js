import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductFormView from '../views/ProductFormView.vue';
import CategoriesView from '../views/CategoriesView.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardView
    },
    {
        path: '/products',
        name: 'products',
        component: ProductsView
    },
    {
        path: '/products/create',
        name: 'product-create',
        component: ProductFormView
    },
    {
        path: '/products/:id/edit',
        name: 'product-edit',
        component: ProductFormView,
        props: true
    },
    {
        path: '/categories',
        name: 'categories',
        component: CategoriesView
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
