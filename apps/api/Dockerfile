FROM node:20-alpine AS builder

WORKDIR /app

# Install API dependencies
COPY package*.json ./
RUN npm ci

# Copy API source and build
COPY . .
RUN npm run build

# ──────────────────────────────────────────────
# Production image
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production API dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled API
COPY --from=builder /app/dist ./dist

EXPOSE 3001

# Start the server
CMD ["node", "dist/server.js"]