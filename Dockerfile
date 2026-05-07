# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Build the React frontend
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS web-builder

WORKDIR /app/web

COPY apps/web/package*.json ./
RUN npm ci --legacy-peer-deps

COPY apps/web/ ./
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Build the API (TypeScript → JS)
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS api-builder

WORKDIR /app/api

COPY apps/api/package*.json ./
RUN npm ci

COPY apps/api/ ./
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3: Production runner
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Install only production API dependencies
COPY apps/api/package*.json ./
RUN npm ci --omit=dev

# Copy compiled API
COPY --from=api-builder /app/api/dist ./dist

# Copy compiled frontend into the path Express expects:
# server.js at /app/dist/server.js uses path.join(__dirname, '../web/dist')
# => resolves to /app/web/dist
COPY --from=web-builder /app/web/dist ./web/dist

# Railway injects PORT; default to 3001 for local testing
EXPOSE 3001

# Start the server
CMD ["node", "dist/server.js"]
