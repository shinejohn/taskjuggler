FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Prune dev dependencies
RUN npm prune --production

CMD ["node", "dist/index.js"]
