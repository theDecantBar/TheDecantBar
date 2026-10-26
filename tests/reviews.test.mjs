import test from "node:test";
import assert from "node:assert/strict";
import { makeApp } from "./helpers/reviewApp.mjs";
import pool from "../server/config/db.js";

test("review API permissions, persistence semantics and privacy", async t => {
 const { app, db } = makeApp(); const server=app.listen(0,"127.0.0.1");
 await new Promise(resolve=>server.once("listening",resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 const request=async(path,method="GET",body,token)=>{const response=await fetch(base+path,{method,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json().catch(()=>null)}};
 const signIn=async email=>(await request("/api/auth/login","POST",{email})).data.token;
 const author=await signIn("customer@example.invalid"),other=await signIn("another@example.invalid"),admin=await signIn("admin@example.invalid");
 const payload={rating:4,text:"Purchased in store. Great fragrance.",fragrance:"Store purchase",city:"Delhi",photo:null};
 try {
 await t.test("public responses exclude private identities and purchase badge",async()=>{const r=await request("/api/reviews");assert.equal(r.status,200);assert.equal(r.data.reviews.length,1);for(const key of ["authorEmail","authorId","orderNumber","verifiedBuyer","verified_buyer","user_id"])assert.equal(Object.hasOwn(r.data.reviews[0],key),false)});
 await t.test("guest cannot create edit delete or fetch permissions",async()=>{for(const [path,method,body] of [["/api/reviews","POST",payload],["/api/reviews/1","PUT",payload],["/api/reviews/1","DELETE"],["/api/reviews/manageable","GET"]])assert.equal((await request(path,method,body)).status,401)});
 let created;
 await t.test("signed-in non-buyer can review and cannot impersonate another author",async()=>{const r=await request("/api/reviews","POST",{...payload,user_id:903,name:"Forged name",verifiedBuyer:true},other);assert.equal(r.status,201);created=r.data.review;assert.equal(created.name,"Another Customer");assert.equal(db.rows.find(row=>row.id===created.id).user_id,902)});
 await t.test("permissions are private and identity-based",async()=>{assert.deepEqual((await request("/api/reviews/manageable","GET",null,author)).data.ids,[1]);assert.deepEqual((await request("/api/reviews/manageable","GET",null,other)).data.ids,[created.id]);assert.equal((await request("/api/reviews/manageable","GET",null,admin)).data.ids.length,2)});
 await t.test("another customer cannot edit or delete",async()=>{assert.equal((await request("/api/reviews/1","PUT",payload,other)).status,403);assert.equal((await request("/api/reviews/1","DELETE",null,other)).status,404);assert.equal(db.rows[0].deleted_at,null)});
 await t.test("author edit survives a fresh GET",async()=>{assert.equal((await request("/api/reviews/1","PUT",{...payload,text:"Updated after wearing it."},author)).status,200);const row=(await request("/api/reviews")).data.reviews.find(r=>r.id===1);assert.equal(row.text,"Updated after wearing it.");assert.equal(row.isEdited,true);assert.equal(row.editedByAdmin,false)});
 await t.test("invalid rating, blank/oversized review and fake images are rejected",async()=>{for(const bad of [{rating:6},{rating:2.5},{rating:"5"},{text:"   "},{text:"x".repeat(2001)},{city:123},{photo:"data:image/svg+xml;base64,PHN2Zy8+"},{photo:"data:image/png;base64,"+Buffer.from("this is not an image").toString("base64")}])assert.equal((await request("/api/reviews/1","PUT",{...payload,...bad},author)).status,400)});
 await t.test("admin can edit through guarded admin endpoint without changing author",async()=>{assert.equal((await request(`/api/admin/reviews/${created.id}`,"PUT",{...payload,text:"Admin corrected the product name."},other)).status,403);const r=await request(`/api/admin/reviews/${created.id}`,"PUT",{...payload,text:"Admin corrected the product name."},admin);assert.equal(r.status,200);assert.equal(r.data.review.name,"Another Customer");assert.equal(r.data.review.editedByAdmin,true)});
 await t.test("author deletion is retained privately and stays absent on repeated GET",async()=>{assert.equal((await request("/api/reviews/1","DELETE",null,author)).status,200);assert.ok(db.rows[0].deleted_at);assert.equal(db.rows[0].deleted_by,901);for(let i=0;i<2;i++)assert.equal((await request("/api/reviews")).data.reviews.some(r=>r.id===1),false);assert.equal((await request("/api/reviews/1","PUT",payload,author)).status,404);assert.equal((await request("/api/reviews/1/photo")).status,404)});
 await t.test("admin deletion leaves a truthful empty list",async()=>{assert.equal((await request(`/api/admin/reviews/${created.id}`,"DELETE",null,admin)).status,200);assert.deepEqual((await request("/api/reviews")).data.reviews,[])});
 await t.test("malformed IDs fail without mutation",async()=>{assert.equal((await request("/api/reviews/1oops","DELETE",null,admin)).status,404)});
 } finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await pool.end()}
});
