# The Decant Bar — Complete Perfume Fragrance Pyramid Final Master Report

## Executive Summary

| Category | Metric | Status / Description |
| :--- | :---: | :--- |
| **Total Live Database Perfumes** | **99** | Authoritative live PostgreSQL catalog (`id` 1–101, IDs 3 and 15 do not exist in DB) |
| **Fully Verified Perfumes** | **76** | Supported by dedicated Fragrantica product page or published manufacturer specifications |
| **Partially Verified Perfumes** | **3** | Formulation verified against benchmark creations (clones without standalone directory page) |
| **Unverified / Insufficient Evidence** | **20** | Generic brand domain only; dedicated individual spec sheet not yet available |
| **Blocked Products** | **0** | All 99 products successfully reconciled to exact brand, title, variant, and database ID |
| **Corrected Fragrance Pyramids** | **76** | Ready for transactional migration upon explicit user approval |
| **Excluded from Migration** | **23** | 20 unverified + 3 partially verified products retained untouched in original DB state |

---

## 1. ID Reconciliation & Catalog Investigation

### Investigation of Prior Discrepancies
Previous audit drafts exhibited mismatched product IDs because an offline list had reordered products sequentially (1..99) instead of adhering to the live PostgreSQL table IDs:
- **ID 2**: Was previously labeled as *Sauvage Elixir* in an offline draft, but in the live database it is **Bleu de Chanel Eau de Toilette** (`Chanel`, `EDP`). *Sauvage Elixir* is actually live **ID 41**.
- **ID 4**: Was previously labeled as *Sauvage EDP* in an offline draft, but in the live database it is **Tom Ford Ombré Leather** (`Tom Ford`, `EDP`). *Dior Sauvage Parfum* is **ID 39**.
- **IDs 99–101**: Were previously labeled as *Dumont Paris Nitro* in an offline draft, but in the live database they are **Bespoke Cuban Tobacco** (#99), **Bespoke Jamaican Tobacco** (#100), and **Bespoke Mexican Tobacco** (#101). *Dumont Paris Nitro* is not in the live database.

All 99 products are now mapped 1:1 against live PostgreSQL records in [final_id_reconciliation_report.csv](file:///c:/Users/arora/decantbar/server/scripts/final_id_reconciliation_report.csv) and [final_live_catalog.json](file:///c:/Users/arora/decantbar/server/scripts/final_live_catalog.json).

---

## 2. Verification Categorization & Source Quality

### A. Fully Verified (76 Products) — Eligible for Migration
These 76 fragrances have individual product page URLs on Fragrantica or published manufacturer specifications with authentic 3-tier note breakdowns:
- **Designer & Niche Classics (64 items)**:
  - Dior: Sauvage EDT (#1), Oud Ispahan (#37), Gris Dior (#38), Sauvage Parfum (#39), Dior Homme Intense (#40), Sauvage Elixir (#41)
  - Chanel: Bleu de Chanel EDT (#2), Bleu de Chanel EDP (#52)
  - Tom Ford: Ombré Leather (#4), Ombré Leather Parfum (#5), Ébène Fumé (#6), Tuscan Leather (#7), White Suede (#8), Grey Vetiver (#9)
  - Creed: Aventus (#10), Absolu Aventus (#11), Green Irish Tweed (#12), Silver Mountain Water (#13), Original Vetiver (#14)
  - Azzaro: The Most Wanted Intense (#16), Wanted by Night (#17)
  - Valentino: Born in Roma Green Stravaganza (#18), Valentino Uomo (#19), Coral Fantasy (#20), Uomo Born in Roma (#21)
  - MFK: Baccarat Rouge 540 EDP (#22)
  - YSL: L'Homme (#23), L'Homme Le Parfum (#24), L'Homme Cologne Bleue (#25), Y EDP (#26), MYSLF Le Parfum (#27)
  - Versace: Eros (#28), Eros Flame (#29), Pour Homme (#30)
  - By Kilian: Blue Moon Ginger Dash (#31), Angels' Share (#32), Roses on Ice (#33)
  - Givenchy: Gentleman Boisée (#34), Gentleman Reserve Privée (#35)
  - Paco Rabanne: 1 Million (#36), Invictus Victory Extreme (#46), Invictus Legend (#47)
  - Xerjoff: Accento (#42), Naxos (#43), Erba Pura (#44)
  - Viktor&Rolf: Spicebomb Extreme (#45)
  - Roberto Cavalli: Splendid Vanilla (#48)
  - Parfums de Marly: Layton (#49), Carlisle (#50)
  - Montblanc: Explorer (#51)
  - Maison Crivelli: Oud Stallion (#53)
  - Roja Parfums: Harrods Exclusive (#54)
  - Giorgio Armani: Armani Code EDP (#55)
  - Bentley: Bentley for Men Intense (#56)
  - Maison Margiela Replica: By the Fireplace (#57), Lazy Sunday Morning (#58), Jazz Club (#59), When the Rain Stops (#60), Beach Walk (#61), Dancing on the Moon (#62), Sailing Day (#63), Flower Market (#64)
- **Verified Middle Eastern Releases (12 items)**:
  - Afnan Turathi Electric (#68), Turathi Blue (#69), Supremacy Not Only Intense (#72), 9 PM (#87), 9 PM Elixir (#88 & #91), 9 AM Dive (#90)
  - Armaf Club de Nuit Intense Man (#70)
  - Rasasi Hawas Ice (#74), Hawas for Him (#76), Hawas Black (#80)
  - Lattafa Khamrah Qahwa (#83)
  - Zimaya Sharaf Blend (#85)
  - French Avenue Liquid Brun (#92)

### B. Partially Verified (3 Products) — Excluded by Default
- **ID 65**: French Avenue Baie 19 (Benchmarked to Le Labo Baie 19 formulation)
- **ID 66**: French Avenue Vulcan Feu (Benchmarked to Stéphane Humbert Lucas 777 God of Fire)
- **ID 86**: Maison Alhambra Jean Lowe Ombre (Benchmarked to Louis Vuitton Ombre Nomade)

### C. Unverified / Insufficient Evidence (20 Products) — Strictly Excluded
These products only have generic brand landing URLs (`https://rasasi.com`, `https://afnan.com`, `https://armaf.ae`, `https://zimayaperfumes.com`, `https://ibraqperfumes.com`):
- **ID 67**: French Avenue Vulcan Sable Brun
- **ID 71**: Armaf Ombre D'Or
- **ID 73**: Afnan Supremacy Collector's Edition
- **ID 75**: Rasasi Hawas Tropical
- **ID 77**: Rasasi Hawas Elixir
- **ID 78**: Rasasi Hawas Fire
- **ID 79**: Rasasi Hawas Verde
- **ID 81**: Rasasi Hawas Malibu
- **ID 82**: Rasasi Hawas Cobra
- **ID 84**: Zimaya Sharaf Blend The Club
- **ID 89**: Afnan 9 PM Night Out
- **IDs 93–101**: Ibraheem Al Qurashi Bespoke Tobacco Collection (9 products: Greek, Brazilian, Spanish, French, Tobacco Extrait, Dominican, Cuban, Jamaican, Mexican Tobacco)

---

## 3. Codebase Changes

### 1. Frontend Fallback Elimination
- **[src/data/perfumeNotes.js](file:///c:/Users/arora/decantbar/src/data/perfumeNotes.js)**:
  - Completely removed the dangerous fallback `return KNOWN_PERFUMES[0]`.
  - Removed loose brand-matching fallback that attributed Aventus to all Creeds or Y to all YSLs.
  - When no authentic profile matches, `getPerfumeProfile()` now returns `null`.
- **[src/pages/ProductDetail.jsx](file:///c:/Users/arora/decantbar/src/pages/ProductDetail.jsx)**:
  - Refactored `profile` construction so PostgreSQL database fields (`top_notes`, `middle_notes`, `base_notes`) are the primary source.
  - Safely defaults to `[]` when `defaultProfile` is `null`.
- **[src/components/product/PerfumePyramid.jsx](file:///c:/Users/arora/decantbar/src/components/product/PerfumePyramid.jsx)**:
  - Added clean luxury "Fragrance Pyramid Under Verification" container when a product has empty note arrays.
  - Tiers with notes render with ingredient visual cards; empty tiers and orphan separator lines are cleanly hidden.

### 2. Admin Dashboard Note Management
- **[src/pages/admin/AdminProducts.jsx](file:///c:/Users/arora/decantbar/src/pages/admin/AdminProducts.jsx)**:
  - Integrated `Verification Status` dropdown (`Fully Verified`, `Partially Verified`, `Unverified`, `Blocked`).
  - Integrated `Authoritative Source URL` text input with direct-launch link icon (`↗`).
  - Preserved multi-tag chip editor (`TagInput`) for Top, Heart, and Base notes.
  - Persists verification metadata to PostgreSQL via `when_to_wear` JSONB without requiring database schema changes or columns.

### 3. Migration & Rollback Scripts
- **[server/scripts/migrate_fragrance_notes.js](file:///c:/Users/arora/decantbar/server/scripts/migrate_fragrance_notes.js)**:
  - Removes all references to non-existent `updated_at`.
  - Gated to only update `Fully Verified` products (76 items) by default.
  - Pre-migration backup snapshot table created automatically inside transaction.
  - Verifies that excluded products retain their exact original values (`IS DISTINCT FROM` check).
- **[server/scripts/rollback_fragrance_notes.js](file:///c:/Users/arora/decantbar/server/scripts/rollback_fragrance_notes.js)**:
  - Restores notes from the backup table without referencing `updated_at`.

---

## 4. Final Dry-Run Validation

Executed command:
```bash
node server/scripts/migrate_fragrance_notes.js --dry-run
```
**Results:**
- Total Products in Catalog: **99**
- Fully Verified (Eligible for Update): **76**
- Excluded (Retain Original Values): **23**
- Database ID Matching: **76 of 76 eligible confirmed in PostgreSQL**
- Zero production database records modified.
