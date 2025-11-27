FROM node:18-alpine

WORKDIR /app

# 1. Copiar archivos de dependencias
COPY package*.json ./

# 2. Instalar dependencias
RUN npm ci --only=production

# 3. Copiar código fuente (sin carpeta prisma)
COPY . .

# 4. Compilar TypeScript
RUN npm run build

EXPOSE 3020

CMD ["npm", "start"]