# ETAPA 1 - Construir os arquivos do React/Vite
FROM node:24-alpine AS build

WORKDIR /app

# Copia as dependências antes do restante do código
COPY package*.json ./
RUN npm ci

# Copia o projeto e gera a versão de publicação
COPY . .
RUN npm run build

# ETAPA 2 - Servir o frontend com Nginx
FROM nginx:alpine

# Copia somente o resultado da etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
