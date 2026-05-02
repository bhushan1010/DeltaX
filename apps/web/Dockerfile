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

# Expose port
EXPOSE 3000

# Serve the built static files (PORT is injected by Railway)
CMD serve -s dist -l $PORT
