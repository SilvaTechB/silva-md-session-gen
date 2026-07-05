FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y git curl --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /tmp/silva-sessions/qr /tmp/silva-sessions/pair

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "index.js"]
