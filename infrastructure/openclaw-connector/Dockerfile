FROM node:22-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.mjs ./

ENV NODE_ENV=production
EXPOSE 8090

CMD ["node", "index.mjs"]
