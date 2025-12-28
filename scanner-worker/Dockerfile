FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Install Node.js 20
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Run as non-root user
USER pwuser

# Start worker
CMD ["node", "dist/worker.js"]
