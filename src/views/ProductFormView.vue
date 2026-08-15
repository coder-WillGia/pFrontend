<template>
  <div class="max-w-2xl mx-auto">
    <!-- Breadcrumb & Back Link -->
    <div class="mb-4">
      <router-link to="/products" class="text-xs font-semibold text-slate-500 hover:text-indigo-600 inline-flex items-center">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a la lista de productos
      </router-link>
    </div>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
        {{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}
      </h1>
      <p class="text-sm text-slate-500 mt-1">
        {{ isEdit ? 'Modifica los detalles del producto existente.' : 'Ingresa la información para crear un nuevo producto.' }}
      </p>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 relative">
      <!-- Loading indicator -->
      <div v-if="loadingData" class="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
        <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Name -->
        <div>
          <label for="name" class="block text-xs font-semibold text-slate-700">Nombre del Producto *</label>
          <div class="mt-1.5">
            <input
              type="text"
              id="name"
              v-model="form.name"
              @input="clearError('name')"
              placeholder="Ej. Camiseta Overskull Premium"
              class="block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
              :class="errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'"
            />
            <span v-if="errors.name" class="text-xs text-red-500 mt-1 block">{{ errors.name }}</span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-xs font-semibold text-slate-700 font-medium">Descripción (Opcional)</label>
          <div class="mt-1.5">
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Describe las características principales del producto..."
              class="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
            ></textarea>
          </div>
        </div>

        <!-- Row: Price, Stock, Category -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Price -->
          <div>
            <label for="price" class="block text-xs font-semibold text-slate-700">Precio *</label>
            <div class="mt-1.5 relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-slate-400 text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="price"
                v-model="form.price"
                @input="clearError('price')"
                placeholder="0.00"
                class="block w-full rounded-lg border pl-7 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                :class="errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'"
              />
            </div>
            <span v-if="errors.price" class="text-xs text-red-500 mt-1 block">{{ errors.price }}</span>
          </div>

          <!-- Stock -->
          <div>
            <label for="stock" class="block text-xs font-semibold text-slate-700">Stock *</label>
            <div class="mt-1.5">
              <input
                type="number"
                id="stock"
                v-model="form.stock"
                @input="clearError('stock')"
                placeholder="0"
                class="block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                :class="errors.stock ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'"
              />
              <span v-if="errors.stock" class="text-xs text-red-500 mt-1 block">{{ errors.stock }}</span>
            </div>
          </div>

          <!-- Category Select -->
          <div>
            <label for="category_id" class="block text-xs font-semibold text-slate-700">Categoría *</label>
            <div class="mt-1.5">
              <select
                id="category_id"
                v-model="form.category_id"
                @change="clearError('category_id')"
                class="block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                :class="errors.category_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'"
              >
                <option value="" disabled>Seleccione...</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <span v-if="errors.category_id" class="text-xs text-red-500 mt-1 block">{{ errors.category_id }}</span>
            </div>
          </div>
        </div>

        <!-- General Error Alert -->
        <div v-if="errors.general" class="p-4 bg-red-50 rounded-lg text-sm text-red-700 font-medium">
          {{ errors.general }}
        </div>

        <!-- Buttons -->
        <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <router-link
            to="/products"
            class="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 inline-flex items-center"
          >
            <span v-if="submitting">Guardando...</span>
            <span v-else>Guardar Producto</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../stores/productStore';
import { useCategoryStore } from '../stores/categoryStore';

const route = useRoute();
const router = useRouter();

const productStore = useProductStore();
const categoryStore = useCategoryStore();

// Form Data
const isEdit = computed(() => !!route.params.id);
const loadingData = ref(false);
const submitting = ref(false);

const form = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: ''
});

// Validation Errors
const errors = ref({
  name: null,
  price: null,
  stock: null,
  category_id: null,
  general: null
});

const categories = computed(() => categoryStore.categories);

onMounted(async () => {
  loadingData.value = true;
  try {
    // Make sure categories are loaded
    await categoryStore.fetchCategories();
    
    if (isEdit.value) {
      const product = await productStore.fetchProduct(route.params.id);
      if (product) {
        form.value.name = product.name;
        form.value.description = product.description || '';
        form.value.price = product.price;
        form.value.stock = product.stock;
        form.value.category_id = product.category_id;
      }
    }
  } catch (err) {
    errors.value.general = 'Ocurrió un error al cargar la información del formulario.';
  } finally {
    loadingData.value = false;
  }
});

const clearError = (field) => {
  errors.value[field] = null;
  errors.value.general = null;
};

// Validate form inputs locally
const validateForm = () => {
  let isValid = true;
  
  if (!form.value.name.trim()) {
    errors.value.name = 'El nombre del producto es obligatorio.';
    isValid = false;
  }
  
  if (form.value.price === '' || form.value.price === null) {
    errors.value.price = 'El precio es obligatorio.';
    isValid = false;
  } else if (isNaN(form.value.price) || parseFloat(form.value.price) <= 0) {
    errors.value.price = 'El precio debe ser un número mayor que 0.';
    isValid = false;
  }
  
  if (form.value.stock === '' || form.value.stock === null) {
    errors.value.stock = 'El stock es obligatorio.';
    isValid = false;
  } else {
    const stockVal = parseFloat(form.value.stock);
    if (isNaN(stockVal) || !Number.isInteger(stockVal) || stockVal < 0) {
      errors.value.stock = 'El stock debe ser un número entero mayor o igual a 0.';
      isValid = false;
    }
  }
  
  if (!form.value.category_id) {
    errors.value.category_id = 'La categoría es obligatoria.';
    isValid = false;
  }
  
  return isValid;
};

// Submit form
const submitForm = async () => {
  // Clear previous errors
  errors.value = { name: null, price: null, stock: null, category_id: null, general: null };

  if (!validateForm()) return;

  submitting.value = true;

  const payload = {
    name: form.value.name,
    description: form.value.description || null,
    price: parseFloat(form.value.price),
    stock: parseInt(form.value.stock),
    category_id: form.value.category_id
  };

  try {
    if (isEdit.value) {
      await productStore.updateProduct(route.params.id, payload);
    } else {
      await productStore.createProduct(payload);
    }
    router.push('/products');
  } catch (err) {
    if (err.response?.status === 422) {
      // Backend validation error mapping
      const backendErrors = err.response?.data?.errors || {};
      for (const field in backendErrors) {
        if (errors.value.hasOwnProperty(field)) {
          errors.value[field] = backendErrors[field][0];
        }
      }
    } else {
      errors.value.general = err.response?.data?.message || 'Error al guardar el producto.';
    }
  } finally {
    submitting.value = false;
  }
};
</script>
