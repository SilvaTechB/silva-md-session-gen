const crypto = require('crypto');

const pending = new Map();
const TOKEN_PATTERN = /^[a-f0-9-]{36}$/i;
const PENDING_TTL_MS = 2 * 60 * 1000;
const SESSION_TTL_MS = 10 * 60 * 1000;

function isValidToken(token) {
    return typeof token === 'string' && TOKEN_PATTERN.test(token);
}

function createHandoff(token) {
    if (!isValidToken(token)) return null;
    pending.set(token, { sessionId: null, expiresAt: Date.now() + PENDING_TTL_MS });
    return token;
}

function publishSession(token, sessionId) {
    if (!isValidToken(token) || typeof sessionId !== 'string' || !sessionId.startsWith('Silva~')) return;
    pending.set(token, { sessionId, expiresAt: Date.now() + SESSION_TTL_MS });
}

function readHandoff(token) {
    if (!isValidToken(token)) return { status: 'not_found' };
    const entry = pending.get(token);
    if (!entry) return { status: 'expired' };
    if (entry.expiresAt <= Date.now()) {
        pending.delete(token);
        return { status: 'expired' };
    }
    return entry.sessionId
        ? { status: 'ready', sessionId: entry.sessionId }
        : { status: 'pending' };
}

function removeHandoff(token) {
    if (isValidToken(token)) pending.delete(token);
}

// Opportunistically discard expired credentials and abandoned pending requests.
const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [token, entry] of pending) {
        if (entry.expiresAt <= now) pending.delete(token);
    }
}, 60 * 1000);
cleanupTimer.unref();

module.exports = { createHandoff, publishSession, readHandoff, removeHandoff, isValidToken };
