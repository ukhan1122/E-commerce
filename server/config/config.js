// config.js
const crypto = require('crypto');

// Generate a random secret key of 64 characters (256 bits)
const jwtSecret = crypto.randomBytes(32).toString('hex');

module.exports = { jwtSecret };
