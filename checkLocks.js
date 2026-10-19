import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 6543,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT pid, usename, state, wait_event_type, wait_event, query
      FROM pg_stat_activity
      WHERE datname = 'postgres' AND pid != pg_backend_pid()
    `);
    console.log("PostgreSQL active processes:", res.rows);
  } catch (err) {
    console.error("Lock check error:", err.message);
  } finally {
    await pool.end();
  }
}

check();
