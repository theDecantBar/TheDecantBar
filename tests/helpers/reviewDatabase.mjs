import fs from "node:fs";
export const users = [
 { id: 901, full_name: "Preview Customer", email: "customer@example.invalid", is_admin: false },
 { id: 902, full_name: "Another Customer", email: "another@example.invalid", is_admin: false },
 { id: 903, full_name: "Preview Admin", email: "admin@example.invalid", is_admin: true },
];
export function makeDatabase(filename = null) {
 let rows = filename && fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : [{ id: 1, user_id: 901, author_name: "Preview Customer", author_email: "customer@example.invalid", city: "Mumbai", fragrance: "Dior Sauvage 5ml", rating: 5, review_text: "The fragrance smells wonderful and the atomizer sprays evenly. My order was carefully packed. A lovely experience with The Decant Bar.", photo: null, is_edited: false, created_at: new Date("2026-10-20T12:00:00Z").toISOString(), deleted_at: null }];
 const persist = () => { if (filename) fs.writeFileSync(filename, JSON.stringify(rows, null, 2)); };
 return {
  get rows() { return rows; }, reset() { rows = []; persist(); },
  async query(sql, args = []) {
   const q = sql.replace(/\s+/g, " ").trim();
   if (q.includes("FROM users WHERE id")) return { rows: users.filter(user => String(user.id) === String(args[0])) };
   if (q.startsWith("SELECT id FROM reviews")) return { rows: rows.filter(row => !row.deleted_at && (args[0] || String(row.user_id) === String(args[1]))).map(row => ({ id: row.id })) };
   if (q.startsWith("SELECT id, author_name")) return { rows: rows.filter(row => !row.deleted_at).map(row => ({ ...row, photo: undefined, has_photo: Boolean(row.photo) })).sort((a,b) => new Date(b.created_at) - new Date(a.created_at) || b.id - a.id) };
   if (q.startsWith("SELECT * FROM reviews")) return { rows: rows.filter(row => !row.deleted_at && String(row.id) === String(args[0])).map(row => ({ ...row })) };
   if (q.startsWith("SELECT photo FROM reviews")) return { rows: rows.filter(row => !row.deleted_at && String(row.id) === String(args[0])).map(row => ({ photo: row.photo })) };
   if (q.startsWith("INSERT INTO reviews")) {
    const row = { id: Math.max(0,...rows.map(row=>row.id))+1, user_id: args[0], author_name: args[1], author_email: args[2], city: args[3], fragrance: args[4], rating: args[5], review_text: args[6], photo: args[7], is_edited: false, created_at: new Date().toISOString(), deleted_at: null };
    rows.push(row); persist(); return { rows: [{ ...row }] };
   }
   if (q.startsWith("UPDATE reviews SET rating")) {
    const row = rows.find(row => !row.deleted_at && String(row.id) === String(args[7]) && (args[8] || String(row.user_id) === String(args[5])));
    if (!row) return { rows: [] };
    Object.assign(row, { rating: args[0], review_text: args[1], photo: args[2], city: args[3], fragrance: args[4], edited_by: args[5], edited_by_admin: args[6], is_edited: true, updated_at: new Date().toISOString() }); persist(); return { rows: [{ ...row }] };
   }
   if (q.startsWith("UPDATE reviews SET deleted_at")) {
    const row = rows.find(row => !row.deleted_at && String(row.id) === String(args[0]) && (args[2] || String(row.user_id) === String(args[1])));
    if (!row) return { rows: [] }; row.deleted_at = new Date().toISOString(); row.deleted_by = args[1]; persist(); return { rows: [{ id: row.id }] };
   }
   throw new Error(`Unexpected SQL in isolated review preview: ${q}`);
  },
 };
}
