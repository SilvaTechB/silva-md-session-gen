# Silva Nexus — WhatsApp Session Generator

> Generate compressed WhatsApp session IDs for your bots in seconds. Deploy anywhere.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.21-blueviolet?style=flat-square)](https://github.com/WhiskeySockets/Baileys)
[![Bot Stars](https://img.shields.io/github/stars/SilvaTechB/silva-md-bot?style=flat-square&label=Silva%20MD%20Bot%20Stars&color=yellow)](https://github.com/SilvaTechB/silva-md-bot)
[![Bot Forks](https://img.shields.io/github/forks/SilvaTechB/silva-md-bot?style=flat-square&label=Forks&color=blue)](https://github.com/SilvaTechB/silva-md-bot/network/members)

---

## Silva MD Bot

This session generator is purpose-built for **[Silva MD Bot](https://github.com/SilvaTechB/silva-md-bot)** — a powerful, feature-rich WhatsApp bot with:

- **90+ commands** spanning AI chat, media downloads, group management, polls, stickers, music, and web tools
- **AI integration** — conversational AI built into your WhatsApp
- **Themed responses** with multiple switchable themes
- **341 stars** · **1.6k forks** · **6 releases** (latest: `silva-v5.0.0`)

> Your session ID is the key to deploying the bot. Generate it here, paste it as `SESSION_ID` on your host.

[![Fork Silva MD Bot](https://img.shields.io/badge/Fork%20Silva%20MD%20Bot-181717?style=for-the-badge&logo=github)](https://github.com/SilvaTechB/silva-md-bot/fork)

---

## What It Does

Silva Nexus authenticates your WhatsApp account via a temporary Baileys socket and delivers a **gzip-compressed, base64-encoded session ID** (`Silva~...`) directly to your WhatsApp DM. Paste that ID as an environment variable on any hosting platform to keep your bot online indefinitely.

---

## Authentication Methods

| Method | Description |
|---|---|
| **Pairing Code** | Enter your phone number, get an 8-digit code, link via WhatsApp settings |
| **QR Code** | Scan the QR with your WhatsApp camera — zero-touch |

Both methods produce the same session ID.

---

## Quick Start

```bash
git clone https://github.com/SilvaTechB/silva-session-generator
cd silva-session-generator
npm install
node index.js
```

Open `http://localhost:8080` in your browser.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the server listens on |
| `NODE_ENV` | `production` | Node environment |

---

## Deploy

One-click deploys available for all major platforms:

| Platform | Type |
|---|---|
| Heroku | Server |
| Render | Server |
| Railway | Server |
| Fly.io | Server |
| Koyeb | Server |
| Vercel | Serverless |
| Docker / VPS | Self-hosted |
| Replit | Both |

> **Heroku note:** Set `NODEJS_ALLOW_WIDE_RANGE=true` if you need to pin a specific Node.js version, or update `engines.node` in `package.json` to a specific major (e.g. `20.x`).

---

## Using the Session in Your Bot

```js
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

async function loadSession() {
    if (!process.env.SESSION_ID || typeof process.env.SESSION_ID !== 'string') {
        throw new Error('SESSION_ID is missing or invalid');
    }

    const [header, b64data] = process.env.SESSION_ID.split('~');

    if (header !== 'Silva' || !b64data) {
        throw new Error("Invalid session format. Expected 'Silva~.....'");
    }

    const compressed = Buffer.from(b64data, 'base64');
    const decompressed = zlib.gunzipSync(compressed);
    fs.writeFileSync(credsPath, decompressed, 'utf8');
    console.log('Session loaded successfully');
}

module.exports = { loadSession };
```

Then in your bot entry point:

```js
const { loadSession } = require('./lib');
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startBot() {
    await loadSession();
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    // ... rest of your bot setup
}
```

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **WhatsApp:** [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v6.7.21
- **Compression:** Node.js built-in `zlib` (Gzip)
- **Logging:** Pino + pino-pretty

---

## Project Structure

```
silva-session-generator/
├── index.js          # Entry point — Express app + routes
├── routes/
│   ├── qr.js         # QR code auth flow
│   ├── pair.js       # Pairing code auth flow
│   └── index.js      # Route exports
├── gift/
│   └── index.js      # Utility helpers (IDs, cleanup)
├── public/
│   ├── index.html    # Landing page
│   └── pair.html     # Pairing code UI
└── package.json
```

---

## License

GPL-3.0 — Fork, star, and self-host freely.

---

Built by [Silva Tech](https://github.com/SilvaTechB)
