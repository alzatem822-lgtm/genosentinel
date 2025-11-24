# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias - 👈 CAMBIADO (sin --only=production)
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript a JavaScript
RUN npm run build

# Exponer puerto
EXPOSE 3010

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3010

# Comando para ejecutar la aplicación
CMD ["node", "dist/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1