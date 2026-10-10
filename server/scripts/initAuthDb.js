import pool from "../config/db.js";

async function initAuthDb() {
  const client = await pool.connect();
  try {
    console.log("Initializing database tables for Auth and Orders...");
    await client.query("BEGIN");

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password_hash VARCHAR(255) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'cod',
        order_notes TEXT,
        subtotal NUMERIC(10, 2) NOT NULL,
        shipping_fee NUMERIC(10, 2) DEFAULT 99,
        total_amount NUMERIC(10, 2) NOT NULL,
        order_status VARCHAR(50) DEFAULT 'Confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Order Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER,
        product_name VARCHAR(255) NOT NULL,
        size_ml INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        image_url TEXT
      );
    `);

    // Create index on user_id and email if not exists
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    await client.query("COMMIT");
    console.log("Auth and Orders database schema initialized successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to initialize database schema:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

initAuthDb();
