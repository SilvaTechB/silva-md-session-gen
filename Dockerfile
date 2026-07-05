FROM node:20-slim
WORKDIR /app

# Install git (needed because a package.json dependency is fetched via git)
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p /tmp/silva-sessions/qr /tmp/silva-sessions/pair
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1
CMD ["node", "index.js"]
