FROM node:20-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
    && git config --global --add url."https://github.com/".insteadOf "git@github.com:"

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p /tmp/silva-sessions/qr /tmp/silva-sessions/pair

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "index.js"]
