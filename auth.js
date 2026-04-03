const jwt = require('jsonwebtoken');

const ACCESS_SECRET = 'access_secret';
const REFRESH_SECRET = 'refresh_secret';

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  ACCESS_SECRET,
  REFRESH_SECRET
};