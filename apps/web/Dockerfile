# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine
WORKDIR /app

# Install serve to host static files
RUN npm install -g serve

# Copy built static files from builder
COPY --from=builder /app/dist ./dist

# Expose port (Railway injects $PORT)
EXPOSE 3000

# Serve static files on Railway's assigned port
CMD serve -s dist -l ${PORT:-3000}
