
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const app = express();
app.use(express.json());

// ================= JWT =================
const ACCESS_SECRET = 'access_secret';
const REFRESH_SECRET = 'refresh_secret';

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' });
}

// ================= REGISTER =================
app.post('/register', async (req, res) => {
  try {
    console.log("🔥 REGISTER HIT", req.body);

    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    console.log("✅ INSERT RESULT:", result.rows);

    res.send('User registered');

  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// ================= LOGIN =================
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(400).send('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send('Wrong password');

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    const jti = uuidv4();

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, jti) VALUES ($1, $2, $3)',
      [user.id, refreshToken, jti]
    );

    res.json({ accessToken, refreshToken });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// ================= CREATE POST =================
app.post('/posts', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const user = jwt.verify(token, ACCESS_SECRET);

    const { content } = req.body;

    await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2)',
      [user.id, content]
    );

    res.send('Post created');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// ================= CHECK DB =================
app.get('/check', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// ================= START SERVER =================
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});