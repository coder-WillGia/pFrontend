# --- ETAPA 1: Construccion (Compilacion de assets de Vue con Node) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ETAPA 2: Produccion (Servidor Node ligero para servir los estaticos compilados) ---
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

# Levantar el servidor de previsualizacion de Vite escuchando directamente y de forma obligatoria en la variable de entorno PORT
CMD npx vite preview --host 0.0.0.0 --port $PORT
