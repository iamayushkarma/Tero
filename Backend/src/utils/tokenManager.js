import crypto from "crypto";

class TokenManager {
  constructor() {
    this.tokens = new Map();
    // Clean expired tokens every 5 minutes
    setInterval(() => this.cleanExpiredTokens(), 5 * 60 * 1000);
  }

  generateToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.tokens.set(token, expiry);
    return token;
  }

  validateToken(token) {
    const expiry = this.tokens.get(token);

    if (!expiry) {
      return false; // Token doesn't exist
    }

    if (Date.now() > expiry) {
      this.tokens.delete(token);
      return false; // Token expired
    }

    // Valid token - delete it (one-time use)
    this.tokens.delete(token);
    return true;
  }

  cleanExpiredTokens() {
    const now = Date.now();
    for (const [token, expiry] of this.tokens.entries()) {
      if (now > expiry) {
        this.tokens.delete(token);
      }
    }
  }
}

export default new TokenManager();
