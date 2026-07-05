FROM node:20-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git curl \
    && rm -rf /var/lib/apt/lists/* \
    && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
    && git config --global url."https://github.com/".insteadOf "git@github.com:"

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
