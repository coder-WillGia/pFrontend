# --- ETAPA 1: Construccion (Compilacion de assets de Vue con Node) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ETAPA 2: Produccion (Servidor estatico para Single Page Application) ---
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve

# Levantar el servidor sirviendo la SPA en el puerto asignado por Render
CMD serve -s dist -l tcp://0.0.0.0:$PORT
