# ETAPA 1 — Construir a aplicação React/Vite
FROM node:24-alpine AS build

WORKDIR /app

# Instala as dependências do projeto
COPY package*.json ./
RUN npm ci

# Copia o código e gera a versão de publicação
COPY . .
RUN npm run build

# ETAPA 2 — Servir os arquivos com Nginx
FROM nginx:alpine

# Copia o frontend compilado
COPY --from=build /app/dist /usr/share/nginx/html

# Substitui a configuração padrão do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]