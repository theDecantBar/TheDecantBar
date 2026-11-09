# The Decant Bar: handover audit

Date: 9 November 2026. Scope: local main branch, uncommitted COD-only work, live storefront browsing, principal application routes/controllers/services, build, lint, payment and review tests, dependency advisories. This is a substantial code and storefront review, not a claim to have independently verified every line, every product, all devices, external service configuration, or legal compliance. No real orders, payments or enquiry emails were submitted. The temporary cart item was removed. No application fixes or deployments were made during this audit.

## Verdict

The shop has a functioning foundation and a consistent visual identity, but is not ready for unconditional client handover. Editorial ratings: visual design 7.5/10; operational readiness 5/10. Security and unfinished business operations take priority over more animations.

## Architecture in ordinary language

| Part | Technology | Job |
|---|---|---|
| Customer-facing website | React, mostly JavaScript/JSX, some TypeScript | Displays products, forms, cart and account screens |
| Styling | Tailwind CSS and custom CSS | Colours, spacing, layout and responsive styling |
| Animation/icons | Motion/Framer Motion, Lucide, some Radix components | Transitions, icons and UI controls |
| Frontend tooling | Vite | Local development and production asset builds |
| Navigation | React Router | Moves between the site's pages |
| Server | Node.js and Express | Checks requests, calculates prices and manages accounts/orders |
| Database | PostgreSQL, accessed with pg; Supabase hosting intended | Stores users, products, size variants, orders, reviews and enquiries |
| Product image storage | Supabase Storage plus bundled public images | Stores image files; database stores image references |
| Customer review photos | Database-backed photo data and a photo endpoint | Separate from the product-image storage implementation |
| Account security | bcrypt password hashes, JWT sessions, optional Google sign-in | Checks passwords and identifies signed-in customers |
| Emails | Resend | Signup/reset codes, order notifications and enquiry emails |
| Online payments | Razorpay Orders/Checkout, verification, webhooks and recovery | Collects and verifies payment without storing card details or UPI PINs in shop tables |
| Hosting/source | Vercel and GitHub | Serves website/API and stores version history |
| Local browser storage | localStorage | Remembers cart and currently stores login token/profile |

Supabase is not being used as the application's login service: login is custom Express/JWT logic. GitHub is not the shop's customer database. PostgreSQL is the database technology; Supabase is the service hosting it.

## Immediate launch blockers

1. **Tracked database data.** `decantbar_backup.sql` is tracked by Git and contains one user row with an email and password hash. Its orders/items sections are empty. No values are reproduced here. Establish whether the row is real and whether repository history was publicly accessible. Remove data from current files and history, use synthetic fixtures instead, review/reset the affected account as appropriate, and invalidate its sessions. Do not mistake removal in a new commit for removal from history. History rewriting needs a coordinated operation.
2. **Email verification can be bypassed.** `server/routes/authRoutes.js` exposes the legacy `/register` handler. `register` in `server/controllers/authController.js` creates a user and issues a session without checking an OTP. It also grants admin status based on configured email addresses. If such an address is unregistered, a person could claim it without owning its mailbox. If an unverified account is later linked to that email's Google login, its old password remains another concern. Require verified ownership before account creation/linking and separate admin provisioning from public signup.
3. **Live checkout still offers Razorpay.** Observed on the deployed checkout. Last account status supplied by the owner was not activated. The default-off COD-only changes are uncommitted locally; do not claim the live store is COD-only. Finish tests, deploy, and verify both hidden UI and server rejection. Keep verification/webhooks for existing payments able to reconcile safely.
4. **Policies are published drafts.** Live Shipping and Terms pages show owner-review placeholders; source shows them in Privacy and Refund pages too. Obtain real business identity, address, support responsibility, courier/serviceability rules, dispatch promise and return/refund process. Owner/legal review is needed; this audit does not certify compliance. Copy must reflect current payment availability.
5. **Hosting plan suitability.** Earlier dashboard screenshots showed Vercel Hobby. Official Vercel guidance restricts Hobby to non-commercial personal use. Confirm current plan and move the commercial shop to a suitable plan/provider before handover. The earlier assumption that a Hobby-compatible cron schedule made Hobby suitable for this shop was incomplete.

## Orders, COD and stock: functionality versus gaps

Already implemented: server-priced cart validation; price snapshots in order items; online orders saved before checkout; saved-order retries; captured-payment verification; payment references/method/mode in admin; stock holds; row locks and sorted variant locking; idempotent online confirmation; missed-payment reconciliation; manual courier/tracking fields.

Needs work:

- COD creation has no equivalent saved-request/idempotency protection. A repeated request after a lost response can create a second COD order when stock permits. A disabled browser button alone does not solve this.
- COD is saved Confirmed with payment Pending. No admin operation was found for recording cash collected and courier settlement. Revenue currently includes only paid/partially refunded orders with payment_mode live, so collected COD money is not represented.
- Cancellation changes a status but does not implement a reviewed, one-time restock or refund workflow. Fulfillment statuses lack a robust transition history and can move backwards. Define cancellation, return and failed-delivery rules.
- COD item inserts omit variant_id. Preserve exact variant references for reliable later restocking and history.
- A paid Stock review order blocks normal fulfillment, but no dedicated resolve-stock-review action was found. The owner needs a documented way to allocate stock or refund without asking the customer to pay again.
- Stock is counted independently per decant size. If 2ml, 5ml and 10ml variants all come from one original bottle, they do not currently share one millilitre balance. The owner must decide whether inventory means prefilled vials or bulk liquid.
- Manual inventory history is limited to the last 15 browser-local entries. Store durable stock movements and actor/time/reason in the database. Absolute stock edits from stale screens can overwrite newer stock values.
- No courier API integration or checkout PIN serviceability verification was found. Tracking is manually entered and updated, not automatic courier tracking.
- Admin order lists are unpaginated. Add server-side pagination before volume grows.
- COD order references use a six-digit random number; use a collision-resistant identifier or retry on unique conflicts.

## Enquiries and email reliability

Contact form is wired to Express and attempts to save a `contact_enquiries` row, then send email through Resend. It is not merely a decorative form. However database failure is tolerated, and a saved enquiry followed by email failure returns an error. This can cause retries/duplicates and inconsistent receipt. No admin enquiry inbox or delivery retry queue was found.

Order, shipping and low-stock email code exists. COD/shipping notifications include unawaited background work that may not finish reliably in serverless execution. Customer and owner emails lack independent durable delivery states. A customer-email sent flag can suppress retrying an owner email that failed; concurrent checks can also race before that flag is saved. Use a database outbox/queue with per-message delivery/retry state. The COD owner email subject uses a case-sensitive COD check even though stored method is `cod`, which can label it Paid incorrectly. A low-stock email links to localhost instead of the deployed admin URL.

Restock requests are stored in `stock_notifications`; no sender/consumer was found. Low-stock email alerts are tied to manual stock edits, not every purchase-driven depletion. Do not promise instant restock alerts until this workflow exists.

No real inbox delivery was tested in this audit. Verify Resend domain, sender configuration, customer and owner inbox receipt, reply routing, bounce behaviour and retries with explicitly designated test recipients.

## Security and database follow-up

Good foundations: bcrypt hashes, JWT checks, protected admin routes, customer-owned order lookup, parameterized SQL, stock transactions, payment signatures and provider amount checks, review ownership checks, some rate limits and photo validation.

Remaining: revoke sessions on password reset/change; reduce 30-day session exposure; replace browser-readable login tokens with an appropriate secure session design and CSRF protection where applicable; make Google audience validation fail closed when configuration is missing; use shared durable rate-limit storage and correct deployment proxy handling; validate OTP attempts atomically; limit restock/checkout abuse; narrow allowed origins; use safe production errors and security headers; enable verified database TLS rather than `rejectUnauthorized:false`; test least-privilege database/Storage access.

Passwords are hashed, not stored as readable passwords, but hashes must still stay private. Public product image buckets are reasonable; customer addresses, emails and order data are not public assets.

Schema changes currently run during application startup. Replace ad hoc setup with versioned, deploy-once migrations and a rollback procedure. Audit actual Supabase policies, exposed schemas, database constraints and backup settings separately: these cannot be proven from repository code alone.

Back up both database and Storage files and practice restoring to a separate environment. Supabase database backups do not contain the actual Storage objects.

## Design and page scorecard

Scores are editorial, not Lighthouse, accessibility certification, or penetration-test results.

| Area | Score | Good | Improvement |
|---|---:|---|---|
| Visual identity | 7.5 | Consistent black/gold, distinctive logo, perfume theme | Less glow, fewer tiny uppercase labels, clearer product-first hierarchy |
| Home | 7 | Clear main shop action and collection sections | Shorter introductory motion, actual decant/packaging photos, concrete trust facts |
| Navbar | 7 | Search, cart, mobile menu, account | Simplify desktop icon navigation; verify mobile focus/keyboard behaviour |
| Catalogue | 6.5 | Search works; category/gender/season filters; sizes | 99 products shown four per page means 25 pages; offer 12–24 per page, price sort, brand/size/availability filters |
| Product pages | 6.5 | Prices/sizes, stock checks, notes and accords | Real delivered-vial photos, accurate naming and verified product facts; shipping/returns near buy button |
| Photography/trust | 6 | Recognizable retail-bottle images and consistent mood | Standardize crops/light; show customer's actual decant; verify image rights; replace generic atmospheric images with real owner/process photos |
| Cart/checkout | 6 | Clear totals, shipping threshold, saved cart | Finish COD-only launch, COD duplicate protection and serviceability; test stale prices/stock |
| About | 6 | Explains decants and process | Real founder story, location and real process evidence; avoid implying a generic image is the actual studio |
| Contact | 5.5 | Connected form, validation, response-time text | Durable enquiry inbox, retry state, direct fallback contact |
| FAQ | 6 | Search/categories, useful decant basics | Add payment failure/COD/tracking/returns answers; current text promises filters not all implemented and omits available 20/50ml sizes |
| Reviews | 7 | Database persistence, ratings/photos, author/admin controls | Remove development content with owner approval; encourage genuine reviews; clarify admin edits; no unsupported verified-purchase claims |
| Footer | 7 | Main shopping/help/policy links | Add confirmed business/support identity and useful verified social links; reduce repeated policy links |
| Policies | 3 | All four principal pages exist | Replace draft placeholders and reconcile promises with real operations |
| Admin/operations | 5.5 | Products, inventory, orders, reviews | COD collection, enquiries, audit history, returns/restocking, exports and pagination |
| Performance | 5 provisional | Build succeeds, some lazy images/WebP | Smaller initial JS, route splitting, shorter loaders/video, optimized delivered images; actual mobile speed measurements still needed |
| Security readiness | 3 | Useful baseline protections | Resolve tracked account data and signup/admin risks first |
| Search visibility | 4 | Basic title/description and social tags | Per-page/product metadata, canonical URLs, sitemap/robots, product structured data, proper not-found page |
| Handover readiness | 4 | Working code in Git and deployment configuration | Real runbook, owner access, backup/restore proof, monitoring and acceptance checklist |

### Specific content/visual observations

- Search for `sauvage` returned three matching products. Cart showed ₹299 + ₹80 = ₹379. No order was submitted.
- Live product names include inconsistent capitalization and `elixer`; correct brand/product naming against actual stock.
- Live review examples include very brief `good`/`great` feedback. Verify whether these are development entries before presenting them as customer proof.
- Best Sellers are selected using a hard-coded popular-name list, not actual store sales. Use Featured Fragrances unless backed by sales data.
- Retail-bottle imagery is useful to identify the fragrance but must clearly say the customer receives a decant, not the retail bottle. Add the actual bottle, label and packaging supplied.
- I cannot establish whether an image was AI-generated merely from appearance. The About imagery is atmospheric/generic; credibility improves with authentic owner/process photography rather than more synthetic luxury scenes. Review licensing/source records for third-party note and brand images.
- Home and product-page estimates for days of wear differ. Avoid fixed performance promises unsupported by the specific fragrance and usage pattern.
- A brief 390px product-page check showed no document-wide horizontal overflow; this is not a full mobile acceptance test.
- Shop and cart retained the Shipping Policy browser title after navigating from that page. Route changes also did not consistently return to the top during browsing. Fix shared metadata and scroll restoration.
- No frontend catch-all 404 route was found.

## Performance and verification evidence

- Production build: passed, with large-chunk warning. Main bundle about 1,099 KB uncompressed / 294 KB gzip; CSS about 116 KB / 19 KB gzip. All main pages/admin pages are eagerly imported. TypeScript check passes but is configured for only four UI TSX entry files with JavaScript checking disabled; it does not validate the whole backend.
- ESLint: 53 errors. These include unused code and React effect/compiler issues; not all are customer-facing failures, but the quality gate is not clean.
- Payment mock tests: all four passed when `ONLINE_PAYMENTS_ENABLED=true` was explicitly set in the test process. Default invocation currently fails after the unfinished default-off COD change. Update test fixtures rather than enabling online payments globally.
- Review tests: all 11 nested cases passed (12 reported including parent), using a temporary local server and simulated database. They test ownership/privacy/validation; their test login does not prove production signup security.
- Prior isolated PostgreSQL payment concurrency tests passed in the previous implementation session. They were not rerun in this audit and used simulated Razorpay, not live payments.
- `npm audit --omit=dev`: four affected package entries (three high, one moderate): body-parser, follow-redirects, qs, vite. Scanner reports fixes available. Review actual reachable dependency paths and upgrade/test; a package advisory is not proof of exploitation, and Vite/dev-server findings do not mean the static site is executing a development server.
- Local hero video is about 4.73 MB. Several repository product images exceed 1 MB; these are asset candidates, not a measured live transfer total. Hero source first references missing `HomeVideo.mp4`, then existing `hero-video.mp4`.
- Initial loader deliberately waits at least 550ms after auth; Shop transition adds 1 second; hero has a 3-second reveal fallback. Remove artificial delays and measure real mobile load/interaction metrics.
- Real mailbox delivery, deployed webhook/cron recovery, real-money payments, courier tracking, tax/invoice correctness, production backup restoration and full cross-device accessibility remain unverified.

## Recommended completion order

1. Contain sensitive repository data and close signup/admin verification weaknesses.
2. Finish and deploy COD-only mode; test new and existing sessions against server enforcement.
3. Complete COD duplicate protection, cash collection accounting, cancellation/restocking and shipping rules.
4. Make enquiries/email notifications durable, and finish or remove restock-alert promises.
5. Replace owner-review policies and generic/test content with approved business details and real photography.
6. Update vulnerable dependencies, clean quality checks, split bundles, optimize assets and fix metadata/404/scroll behaviour.
7. Prove a complete COD lifecycle and failure recovery in an isolated test environment; verify permitted production smoke tests with the owner.
8. After Razorpay activation, configure live keys/webhook/capture/recovery and verify a controlled real payment and refund before opening online payments generally.
9. Handover owner-controlled accounts, billing/renewals, safe credential storage, backup restore instructions, support runbook and maintenance responsibilities.

Avoid adding optional wishlists, chatbots, coupons or more animation before these foundations are complete.

## Reference guidance

- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) and [Fair Use](https://vercel.com/docs/limits/fair-use-guidelines): non-commercial restriction.
- [OWASP HTML5 security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html): browser localStorage and session-token risks.
- [Supabase backup documentation](https://supabase.com/docs/guides/platform/backups): database backup versus Storage object backup.

## Owner decisions required for final handover

Confirm legal/business identity and contact address; actual dispatch location and days; courier/COD serviceable PIN codes; return/damage/cancellation rules; refund responsibility; tax/invoice treatment; whether inventory is prefilled vials or bulk ml; actual photo permissions and sourcing claims; support inbox owner; hosting/database/email budgets; Razorpay approval. Do not invent these details in code or policy text.
