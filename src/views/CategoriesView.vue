<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Categorías</h1>
        <p class="text-sm text-slate-500 mt-1">Crea y administra las categorías de tu catálogo.</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center transition shadow-sm"
      >
        <svg class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Categoría
      </button>
    </div>

    <!-- Table / Content -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Loading state -->
      <div v-if="categoryStore.loading && categoryStore.categories.length === 0" class="py-12 flex flex-col items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-indigo-600 mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm text-slate-500 font-medium">Cargando categorías...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="categoryStore.categories.length === 0" class="py-16 text-center">
        <div class="inline-flex p-4 bg-slate-100 text-slate-400 rounded-full mb-4">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
          </svg>
        </div>
        <h3 class="text-slate-900 font-bold text-base">No hay categorías</h3>
        <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Comienza creando tu primera categoría para organizar tus productos.</p>
        <button
          @click="openCreateModal"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center mt-5 transition shadow-sm"
        >
          Crear Categoría
        </button>
      </div>

      <!-- Categories Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID (UUID)</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-6 py-4 class-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha Creación</th>
              <th scope="col" class="relative px-6 py-4 text-right">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="category in categoryStore.categories" :key="category.id" class="hover:bg-slate-50/70 transition">
              <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-500 select-all">{{ category.id }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{{ category.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{{ category.created_at || '-' }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                <button 
                  @click="openEditModal(category)" 
                  class="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                >
                  Editar
                </button>
                <button 
                  @click="confirmDelete(category)" 
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

    <!-- Modal Form (Create/Edit) -->
    <div v-if="modalOpen" class="fixed inset-0 z-40 overflow-y-auto" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" @click="closeModal"></div>

      <!-- Modal Content Wrapper -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div class="absolute right-0 top-0 pr-4 pt-4">
            <button @click="closeModal" class="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm">
            <div>
              <h3 class="text-base font-bold leading-6 text-slate-900">
                {{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
              </h3>
              <p class="text-xs text-slate-400 mt-1">Ingresa los detalles de la categoría.</p>
              
              <div class="mt-4">
                <label for="name" class="block text-xs font-semibold text-slate-700">Nombre de la Categoría</label>
                <div class="mt-1.5">
                  <input
                    type="text"
                    id="name"
                    v-model="form.name"
                    required
                    maxlength="100"
                    placeholder="Ej. Ropa, Electrónica..."
                    class="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                  <!-- Validation error -->
                  <span v-if="validationError" class="text-xs text-red-500 mt-1 block">{{ validationError }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex flex-row-reverse gap-3">
              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:w-auto disabled:opacity-50"
              >
                <span v-if="submitting">Guardando...</span>
                <span v-else>Guardar</span>
              </button>
              <button
                type="button"
                @click="closeModal"
                class="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:w-auto mt-0"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
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
              <h3 class="text-base font-bold leading-6 text-slate-900">¿Eliminar categoría?</h3>
              <div class="mt-2">
                <p class="text-sm text-slate-500">
                  ¿Estás seguro de que deseas eliminar la categoría <span class="font-semibold text-slate-800">"{{ categoryToDelete?.name }}"</span>? Esta acción no se puede deshacer.
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
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';

const categoryStore = useCategoryStore();

// Form States
const modalOpen = ref(false);
const isEdit = ref(false);
const selectedCategoryId = ref(null);
const form = ref({ name: '' });
const submitting = ref(false);
const validationError = ref(null);

// Delete States
const deleteModalOpen = ref(false);
const categoryToDelete = ref(null);
const deleting = ref(false);

onMounted(() => {
  categoryStore.fetchCategories();
});

// Create Modal actions
const openCreateModal = () => {
  isEdit.value = false;
  selectedCategoryId.value = null;
  form.value.name = '';
  validationError.value = null;
  modalOpen.value = true;
};

// Edit Modal actions
const openEditModal = (category) => {
  isEdit.value = true;
  selectedCategoryId.value = category.id;
  form.value.name = category.name;
  validationError.value = null;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

// Submit form (Create / Update)
const submitForm = async () => {
  if (!form.value.name.trim()) {
    validationError.value = 'El nombre de la categoría es obligatorio.';
    return;
  }

  submitting.value = true;
  validationError.value = null;

  try {
    if (isEdit.value) {
      await categoryStore.updateCategory(selectedCategoryId.value, form.value.name);
    } else {
      await categoryStore.createCategory(form.value.name);
    }
    closeModal();
  } catch (err) {
    if (err.response?.status === 422) {
      // Validation error from backend
      const errors = err.response?.data?.errors;
      validationError.value = errors?.name ? errors.name[0] : 'Error de validación.';
    } else {
      validationError.value = err.response?.data?.message || 'Ocurrió un error al guardar la categoría.';
    }
  } finally {
    submitting.value = false;
  }
};

// Delete actions
const confirmDelete = (category) => {
  categoryToDelete.value = category;
  deleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  deleteModalOpen.value = false;
  categoryToDelete.value = null;
};

const executeDelete = async () => {
  if (!categoryToDelete.value) return;

  deleting.value = true;
  try {
    await categoryStore.deleteCategory(categoryToDelete.value.id);
    closeDeleteModal();
  } catch (err) {
    // Error is handled globally by Axios interceptor (e.g. shows associated products message)
    closeDeleteModal();
  } finally {
    deleting.value = false;
  }
};
</script>
