# ==========================================
# FRONTEND DOCKERFILE - React + Vite
# ==========================================

# ETAPA 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Argumento para la URL del backend
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build de producción
RUN npm run build

# ETAPA 2: Servidor Nginx
FROM nginx:alpine

# Copiar archivos build al servidor
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]