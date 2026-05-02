FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build || npx tsc

# Expose API port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]