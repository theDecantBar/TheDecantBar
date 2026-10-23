import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isSsl =
  process.env.DB_SSL === "true" ||
  process.env.DB_SSL === true ||
  String(process.env.DB_HOST || "").includes("supabase");

// In Vercel serverless execution contexts, limit pool per container to 2 connections
// and shorten idle timeout to prevent exhausting Supabase connection quotas.
const isVercel = Boolean(process.env.VERCEL);
const defaultMax = isVercel ? 2 : 10;
const maxConnections = Number(process.env.DB_MAX_CONNECTIONS) || defaultMax;
const idleTimeoutMillis = isVercel ? 10000 : 60000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: isSsl ? { rejectUnauthorized: false } : false,
  max: maxConnections,
  idleTimeoutMillis,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

export default pool;
