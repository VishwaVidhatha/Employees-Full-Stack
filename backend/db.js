const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '::1',
  database: 'project',
  password: '194720',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
