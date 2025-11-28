FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json ./
RUN npm install --production

# Copiar código compilado
COPY dist/ ./dist/

# Copiar variables de entorno
COPY .env.docker ./.env

# Exponer puerto
EXPOSE 3010

# Comando de inicio
CMD ["node", "dist/server.js"]