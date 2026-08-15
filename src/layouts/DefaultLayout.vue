<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Mobile Header -->
    <header class="bg-indigo-700 text-white flex md:hidden justify-between items-center px-4 py-3 shadow-md">
      <div class="flex items-center space-x-2">
        <span class="font-bold text-lg tracking-wider">MI PRUEBA</span>
      </div>
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen" 
        class="p-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle navigation menu"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Sidebar Navigation -->
    <aside 
      class="bg-slate-950 text-slate-200 w-full md:w-64 flex-shrink-0 flex flex-col border-r border-slate-800 transition-all duration-300 md:block"
      :class="{ 'hidden': !mobileMenuOpen }"
    >
      <div class="p-6 border-b border-slate-900 hidden md:block">
        <h1 class="text-xl font-bold text-white tracking-wider flex items-center">
          <span class="bg-indigo-600 text-white p-1.5 rounded-lg mr-2 text-xs">TI</span>
          Tienda Panel
        </h1>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1">
        <!-- Dashboard Link -->
        <router-link 
          to="/" 
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActiveRoute('dashboard') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'"
        >
          <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
          Dashboard
        </router-link>

        <!-- Products Link -->
        <router-link 
          to="/products" 
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActiveRoute('products') || isActiveRoute('product-create') || isActiveRoute('product-edit') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'"
        >
          <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Productos
        </router-link>

        <!-- Categories Link -->
        <router-link 
          to="/categories" 
          @click="mobileMenuOpen = false"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActiveRoute('categories') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'"
        >
          <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Categorías
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-950 text-xs text-slate-500">
        Prueba Técnica v1.0.0
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Breadcrumb / Upper Header bar on Desktop -->
      <div class="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between shadow-sm">
        <h2 class="text-sm font-semibold text-slate-700">Panel de Administración</h2>
        <div class="flex items-center space-x-2 text-xs text-slate-400">
          <span>Prueba</span>
          <span>&middot;</span>
          <span class="text-slate-600 font-medium">Vue 3 Frontend</span>
        </div>
      </div>

      <!-- View Container -->
      <div class="p-6 max-w-7xl w-full mx-auto flex-1">
        <slot></slot>
      </div>
    </main>

    <!-- Toast Notifications global component -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ToastNotification from '../components/common/ToastNotification.vue';

const mobileMenuOpen = ref(false);
const route = useRoute();

const isActiveRoute = (name) => {
  return route.name === name;
};
</script>
