# silva-session

A WhatsApp Session ID Generator web application that allows users to authenticate their WhatsApp accounts via QR Code or Pairing Code. After authentication, it generates a compressed base64-encoded Session ID for use with WhatsApp bots.

## Project Structure

- `index.js` - Main Express server entry point, runs on port 8080
- `routes/` - Route handlers for QR and pairing code flows
  - `qr.js` - QR code authentication route
  - `pair.js` - Pairing code (phone number) authentication route
  - `index.js` - Route exports
- `public/` - Static frontend assets
  - `index.html` - Landing page
  - `pair.html` - Pairing code UI
- `gift/` - Utility functions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **WhatsApp Library**: @whiskeysockets/baileys (baileys@6.7.21)
- **Package Manager**: npm

## Running the App

```bash
node index.js
```

Server starts on port 8080 (0.0.0.0).

## Deployment

Configured for autoscale deployment with `node index.js`.
