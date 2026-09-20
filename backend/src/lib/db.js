import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
