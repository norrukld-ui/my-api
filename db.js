const { Pool } = require('pg');

// Render автоматически ставит NODE_ENV = 'production'
const isProduction = process.env.NODE_ENV === 'production';

// Если DATABASE_URL нет в окружении, используем твою новую ссылку
const connectionString = process.env.DATABASE_URL || 'postgresql://my_auth_db_h1rq_user:p1FRSLhWPYUhAEWzOaMK3poEmcvklHgX@dpg-d783p8ffte5s738orq80-a/my_auth_db_h1rq';

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;