# STAGE 1: Build Environment
FROM node:18.20.8-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# STAGE 2: Runtime Environment
FROM docker.io/nginx:1.31.1-alpine3.23
COPY --from=builder /app/dist/word-weaver /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
