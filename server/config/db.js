import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isSsl = process.env.DB_SSL === "true" || process.env.DB_SSL === true || String(process.env.DB_HOST || "").includes("supabase");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 6543,
  ssl: isSsl ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

export default pool;