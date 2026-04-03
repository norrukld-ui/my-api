const { Pool } = require('pg');

const pool = new Pool({
  user: 'madinabaktybek',
  host: 'localhost',
  database: 'mini_instagram', // ✅ ВОТ ТУТ ИСПРАВЛЕНО
  password: '',
  port: 5432,
});

module.exports = pool;