import pool from '../../server/config/db.js';
for (const url of ['https://www.thedecantbar.com/', 'https://www.thedecantbar.com/api/products', 'https://www.thedecantbar.com/api/reviews', 'https://www.thedecantbar.com/api/admin/stats', 'https://www.thedecantbar.com/api/orders/my-orders']) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const body = await res.text();
    const result = { url, status: res.status, headers: Object.fromEntries(['content-type', 'strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'cache-control'].map(k => [k, res.headers.get(k)])) };
    try { const data = JSON.parse(body); result.shape = Array.isArray(data) ? { count: data.length, keys: Object.keys(data[0] || {}) } : { keys: Object.keys(data), count: data.reviews?.length, publicReviewKeys: Object.keys(data.reviews?.[0] || {}) }; } catch { result.bytes = body.length; }
    console.log(JSON.stringify(result));
  } catch (e) { console.log(JSON.stringify({ url, error: e.message })); }
}
try {
  const client = await pool.connect();
  try {
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout='10000'");
    const queries = {
      tables: "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public'",
      policies: "SELECT tablename, roles, cmd FROM pg_policies WHERE schemaname='public'",
      grants: "SELECT table_name,grantee,privilege_type FROM information_schema.role_table_grants WHERE table_schema='public' AND grantee IN ('anon','authenticated','PUBLIC')",
      constraints: "SELECT conrelid::regclass::text AS table_name, conname, pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE connamespace='public'::regnamespace",
      role: 'SELECT current_user, rolsuper, rolcreaterole, rolcreatedb, rolbypassrls FROM pg_roles WHERE rolname=current_user',
      columns: "SELECT table_name,column_name,data_type FROM information_schema.columns WHERE table_schema='public'",
      imageReferences: "SELECT id, image_url FROM products",
    };
    for (const [name, sql] of Object.entries(queries)) {
      await client.query('SAVEPOINT audit');
      try { const result = await client.query(sql); console.log(JSON.stringify({ check: name, rows: result.rows })); }
      catch (e) { await client.query('ROLLBACK TO SAVEPOINT audit'); console.log(JSON.stringify({ check: name, error: e.message })); }
    }
    await client.query('ROLLBACK');
  } finally { client.release(); }
} catch (e) { console.log(JSON.stringify({ check: 'database', error: e.message })); }
finally { await pool.end(); }
