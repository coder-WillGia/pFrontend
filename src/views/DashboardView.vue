<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
      <p class="text-sm text-slate-500 mt-1">Resumen general de tu inventario de productos y categorías.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="n in 3" :key="n" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
        <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div class="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-slate-100 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Categories -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Categorías</p>
          <p class="text-3xl font-bold text-slate-950 mt-1">{{ categoryCount }}</p>
          <router-link to="/categories" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center mt-3">
            Gestionar categorías &rarr;
          </router-link>
        </div>
        <div class="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>

      <!-- Total Products -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Productos</p>
          <p class="text-3xl font-bold text-slate-950 mt-1">{{ productCount }}</p>
          <router-link to="/products" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center mt-3">
            Gestionar productos &rarr;
          </router-link>
        </div>
        <div class="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      <!-- Total Stock -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Stock Total</p>
          <p class="text-3xl font-bold text-slate-950 mt-1">{{ totalStock }}</p>
          <p class="text-xs text-slate-400 mt-3">Unidades totales disponibles</p>
        </div>
        <div class="p-4 bg-amber-50 text-amber-600 rounded-xl">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Last Products Added -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-900 mb-4">Últimos Productos Añadidos</h3>
        <div v-if="loading" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-10 bg-slate-100 rounded w-full animate-pulse"></div>
        </div>
        <div v-else-if="products.length === 0" class="text-sm text-slate-500 py-6 text-center">
          No hay productos disponibles.
        </div>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="product in latestProducts" :key="product.id" class="py-3 flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-slate-800">{{ product.name }}</p>
              <p class="text-xs text-slate-400">Stock: {{ product.stock }} unidades</p>
            </div>
            <span class="text-sm font-bold text-slate-900">${{ parseFloat(product.price).toFixed(2) }}</span>
          </li>
        </ul>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-slate-900 mb-4">Accesos Rápidos</h3>
          <p class="text-sm text-slate-500 mb-6">Realiza las acciones más comunes del inventario en un clic.</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <router-link to="/products/create" class="flex flex-col items-center justify-center p-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition rounded-xl text-center">
            <svg class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs font-semibold">Añadir Producto</span>
          </router-link>
          <router-link to="/categories" class="flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-700 hover:bg-slate-100 transition rounded-xl text-center">
            <svg class="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            <span class="text-xs font-semibold">Nueva Categoría</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dashboardService from '../services/dashboardService';

const loading = ref(true);
const stats = ref({
  total_categories: 0,
  total_products: 0,
  total_stock: 0,
  latest_products: []
});

onMounted(async () => {
  loading.value = true;
  try {
    const response = await dashboardService.getStats();
    if (response.success) {
      stats.value = response.data;
    }
  } catch (err) {
    console.error('Error al obtener estadísticas del dashboard', err);
  } finally {
    loading.value = false;
  }
});

const productCount = ref(0);
const categoryCount = ref(0);
const totalStock = ref(0);
const products = ref([]);

// Sync values for template properties
import { watchEffect } from 'vue';
watchEffect(() => {
  productCount.value = stats.value.total_products;
  categoryCount.value = stats.value.total_categories;
  totalStock.value = stats.value.total_stock;
  products.value = stats.value.latest_products;
});

const latestProducts = ref([]);
watchEffect(() => {
  latestProducts.value = stats.value.latest_products;
});
</script>
