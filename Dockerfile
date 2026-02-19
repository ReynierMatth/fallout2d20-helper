# ============================================================
# Stage 1: Install dependencies for both front and back
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Install front dependencies
COPY front/package.json front/package-lock.json* front/
RUN cd front && npm ci

# Install back dependencies (including devDependencies for tsx)
COPY back/package.json back/package-lock.json* back/
RUN cd back && npm ci

# ============================================================
# Stage 2: Build frontend (Vite + PWA)
# ============================================================
FROM node:22-alpine AS front-build

WORKDIR /app
COPY --from=deps /app/front/node_modules front/node_modules
COPY front/ front/

# Build with API_URL pointing to /api (same origin, proxied by nginx)
RUN cd front && VITE_API_URL=/api npm run build

# ============================================================
# Stage 3: Production runtime
# ============================================================
FROM node:22-alpine AS runtime

RUN apk add --no-cache nginx

WORKDIR /app

# Copy backend source + deps (tsx runs TypeScript directly)
COPY --from=deps /app/back/node_modules ./back/node_modules
COPY back/package.json ./back/
COPY back/src ./back/src
COPY back/drizzle ./back/drizzle
COPY back/drizzle.config.ts ./back/

# Copy frontend source (seed scripts import from front/src/data/)
# package.json needed for "type": "module" resolution
COPY front/package.json ./front/
COPY front/src ./front/src

# Copy frontend build to nginx
COPY --from=front-build /app/front/dist ./front/dist

# Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Entrypoint script (convert CRLF to LF for Windows compatibility)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
