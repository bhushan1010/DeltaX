FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies + serve globally
RUN npm install --legacy-peer-deps && npm install -g serve

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# Ensure we listen on port 3000 and bind to all interfaces
ENV PORT=3000
EXPOSE 3000

# Explicitly bind to 0.0.0.0 and port 3000
CMD ["serve", "-s", "dist", "-l", "3000", "-a", "0.0.0.0"]
