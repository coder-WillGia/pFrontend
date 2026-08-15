<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Productos</h1>
        <p class="text-sm text-slate-500 mt-1">Administra el inventario de productos, precios y stock.</p>
      </div>
      <router-link
        to="/products/create"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center transition shadow-sm"
      >
        <svg class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Producto
      </router-link>
    </div>

    <!-- Table / Content -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Loading state -->
      <div v-if="loading && products.length === 0" class="py-12 flex flex-col items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-indigo-600 mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm text-slate-500 font-medium">Cargando productos...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="products.length === 0" class="py-16 text-center">
        <div class="inline-flex p-4 bg-slate-100 text-slate-400 rounded-full mb-4">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 class="text-slate-900 font-bold text-base">No hay productos</h3>
        <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Comienza agregando productos a tu inventario.</p>
        <router-link
          to="/products/create"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center mt-5 transition shadow-sm"
        >
          Agregar Producto
        </router-link>
      </div>

      <!-- Products Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th scope="col" class="relative px-6 py-4 text-right">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50/70 transition">
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-slate-900">{{ product.name }}</div>
                <div class="text-xs text-slate-400 mt-0.5 max-w-xs truncate" :title="product.description">
                  {{ product.description || 'Sin descripción' }}
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  {{ getCategoryName(product.category_id) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                ${{ parseFloat(product.price).toFixed(2) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <span 
                  class="font-semibold" 
                  :class="parseInt(product.stock) === 0 ? 'text-red-500' : parseInt(product.stock) < 10 ? 'text-amber-500' : 'text-slate-600'"
                >
                  {{ product.stock }} ud.
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                <router-link 
                  :to="`/products/${product.id}/edit`" 
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Editar
                </router-link>
                <button 
                  @click="confirmDelete(product)" 
                  class="text-red-600 hover:text-red-900 inline-flex items-center"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="deleteModalOpen" class="fixed inset-0 z-40 overflow-y-auto" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" @click="closeDeleteModal"></div>

      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-red-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-bold leading-6 text-slate-900">¿Eliminar producto?</h3>
              <div class="mt-2">
                <p class="text-sm text-slate-500">
                  ¿Estás seguro de que deseas eliminar el producto <span class="font-semibold text-slate-800">"{{ productToDelete?.name }}"</span>? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 flex flex-row-reverse gap-3">
            <button
              type="button"
              @click="executeDelete"
              :disabled="deleting"
              class="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto disabled:opacity-50"
            >
              <span v-if="deleting">Eliminando...</span>
              <span v-else>Confirmar</span>
            </button>
            <button
              type="button"
              @click="closeDeleteModal"
              class="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:w-auto mt-0"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '../stores/productStore';
import { useCategoryStore } from '../stores/categoryStore';

const productStore = useProductStore();
const categoryStore = useCategoryStore();

// Delete States
const deleteModalOpen = ref(false);
const productToDelete = ref(null);
const deleting = ref(false);

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories()
  ]);
});

const loading = computed(() => productStore.loading || categoryStore.loading);
const products = computed(() => productStore.products);

const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category ? category.name : 'Sin Categoría';
};

// Delete actions
const confirmDelete = (product) => {
  productToDelete.value = product;
  deleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  deleteModalOpen.value = false;
  productToDelete.value = null;
};

const executeDelete = async () => {
  if (!productToDelete.value) return;

  deleting.value = true;
  try {
    await productStore.deleteProduct(productToDelete.value.id);
    closeDeleteModal();
  } catch (err) {
    closeDeleteModal();
  } finally {
    deleting.value = false;
  }
};
</script>
