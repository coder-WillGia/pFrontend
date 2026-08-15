# Tienda Panel - Frontend (Vue 3 + Vite)

Este es el frontend de la prueba técnica para la gestión de productos y categorías. Se comunica de forma exclusiva con la API REST de Laravel 11.

## 🚀 Tecnologías

* **Vue 3** (Composition API)
* **Vite** (Build Tool)
* **Pinia** (Gestión de Estado Global)
* **Vue Router** (Enrutamiento)
* **Axios** (Peticiones HTTP)
* **Tailwind CSS** (Estilos y Diseño Responsivo)

---

## 📋 Requisitos Previos

* **Node.js** (v18 o superior)
* **npm** (v9 o superior)
* **Backend Laravel** corriendo en segundo plano (normalmente en `http://127.0.0.1:8000`).

---

## 🛠️ Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```
   Asegúrate de que la variable `VITE_API_URL` apunte a la dirección correcta de tu API en Laravel:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible por defecto en `http://localhost:5173`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📁 Estructura del Proyecto

```text
frontend/
├── src/
│   ├── components/       # Componentes comunes e independientes de UI
│   ├── layouts/          # Layout principal (DefaultLayout.vue) con el menú de navegación y barra lateral
│   ├── services/         # Clientes API centralizados (api.js, productService.js, categoryService.js)
│   ├── stores/           # Stores de Pinia (productStore.js, categoryStore.js, notificationStore.js)
│   ├── router/           # Enrutamiento de la aplicación con Vue Router
│   ├── views/            # Vistas principales (Dashboard, Productos, Formulario, Categorías)
│   ├── App.vue           # Componente raíz
│   └── main.js           # Inicialización de Vue, Pinia y Router
├── .env                  # Variables de entorno
├── tailwind.config.js    # Configuración de Tailwind CSS
└── package.json          # Dependencias y scripts del proyecto
```

---

## 🛡️ Características Principales

### 📡 Interceptor Global de Axios (`src/services/api.js`)
Configura las cabeceras comunes de comunicación y atrapa de forma centralizada todos los errores de la API.
* **422 Validation:** Proporciona los errores detallados directamente a los componentes para ser mostrados debajo de cada campo del formulario.
* **400 / 404 / 500:** Extrae los mensajes de error devueltos por el backend y los envía al `notificationStore` para mostrar un Toast dinámico al usuario.
* **Errores de Red:** Captura la pérdida de conexión y avisa al usuario: *"No se pudo conectar con el servidor. Verifica tu conexión de red."*

### 🍍 Gestión de Estado Global (Pinia)
* **`productStore` / `categoryStore`**: Manejan la lista de datos, estados de carga (`loading`) y errores para evitar llamadas duplicadas o múltiples clics del usuario.
* **`notificationStore`**: Centraliza el sistema de notificaciones del tipo Toast (Mensajes de Éxito, Error e Información) autohinchables tras 4 segundos.

### 🌐 Enrutamiento Disponible
* `/` ➔ Dashboard (Indicadores generales como stock total, productos, categorías y accesos rápidos).
* `/products` ➔ Listado de productos (Tabla interactiva y responsiva con opciones de edición y eliminación).
* `/products/create` ➔ Formulario para crear un nuevo producto con select de categorías dinámico.
* `/products/:id/edit` ➔ Formulario para editar un producto existente.
* `/categories` ➔ Sección de categorías (Permite listado, creación, edición y borrado directo en una interfaz modal unificada).
