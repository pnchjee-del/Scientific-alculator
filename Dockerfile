# Multi-stage production Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:20  # Avoid using light alpine variants if they lack build tools

WORKDIR /app  # <--- CRITICAL FIX: Forces npm to run inside an application folder

COPY package*.json ./
RUN npm install

COPY . .


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 3000

CMD ["node", "server.ts"]
