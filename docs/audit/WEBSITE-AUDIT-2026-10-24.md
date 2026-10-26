# The Decant Bar — website review in simple language

24 October 2026

Your website looks polished, but some important protections and business functions are unfinished. Think of it as a shop with attractive shelves where the locks, payment checks, and stock register still need work.

**Current rating: 4/10 for readiness to accept customers.** You do not need to rebuild everything. The existing website is a useful foundation.

“Found” means an issue was seen in the code or configuration. It does not mean someone has already exploited it. No production records were changed during the audit.

## 1. Login, customer accounts, and admin security

| Issue | Simple example | How to fix it |
|---|---|---|
| **Email verification can be skipped. Critical.** | The signup screen asks for an OTP, but another signup route creates an account without it. | Remove that alternate route. Require successful verification on the server for every signup. |
| **An unregistered admin email could be claimed. Critical.** | If an email listed as an admin has no account yet, someone could register it without proving inbox ownership and receive admin access. This does not overwrite an existing account. | Never grant admin rights just because someone types a particular email. Assign rights privately and require two-step verification. |
| **Order history uses email as proof of ownership.** | An order entered with another person’s email could appear in that person’s account. | Connect each order to the account that actually placed it. Contact email must not decide access. |
| **Password changes do not invalidate old login tokens.** | Someone with a stolen token could retain access after the password changes. | End existing sessions after a reset and add “log out all devices.” |
| Password rules are weak. | A six-character password is accepted. | Require stronger passwords, allow password managers, and block commonly compromised passwords. |

**Already good:** passwords are hashed, and the backend checks admin permissions. Changing the browser’s admin flag alone does not bypass backend protection.

## 2. Payments and checkout

| Issue | Simple example | How to fix it |
|---|---|---|
| **Payment is not securely connected to the purchased cart. Critical.** | A valid cheaper payment could potentially be paired with a more expensive cart. | Save the exact cart and amount before payment. Confirm payment belongs to that checkout and covers the correct amount. |
| **A payment could be submitted again.** | Repeating a confirmation could create another order from one payment. | Store unique payment IDs. Repeated confirmations must return the existing order. |
| Payment recovery is incomplete. | A customer pays, then closes the browser before the website saves the order. | Let Razorpay securely notify the server independently of the browser and reconcile missed payments. |
| Refund and COD management are incomplete. | Cancelling an order does not automatically complete the correct payment and inventory process. | Add explicit refund, COD-collected, cancellation, and restocking workflows. |

**Already good:** prices are recalculated on the server. The inspected code does not store card numbers, CVVs, or UPI PINs.

## 3. Stock and product management

| Issue | Simple example | How to fix it |
|---|---|---|
| Two customers can potentially buy the last bottle. | Both checkouts see one available before either finishes. | Reserve or deduct stock atomically so only one purchase succeeds. |
| Disabled sizes remain orderable through the API. | A disabled 5ml size can still be purchased through a direct request. | Check availability and enabled status on the server during checkout. |
| Stock displays can become stale. | An admin changes stock, but the storefront temporarily shows the old quantity. | Refresh cached product data after stock changes. |
| Product information is incomplete. | Several admin rows show missing brands or “No notes set.” | Complete and validate brand, concentration, description, notes, sizes, prices, and images. |
| Similar names need checking. | “9PM ELIXER” appears more than once with different concentrations. | Give each genuine product a clear identity and SKU. Check before merging: they may be different products. |

**Useful future feature:** track remaining liquid in the original bottle. Selling one 10ml decant should reduce available liquid by 10ml if decants are prepared to order.

## 4. Testimonials and reviews

| Issue | Simple example | How to fix it |
|---|---|---|
| **Review responses reveal private information.** | Review data includes customer email addresses and order numbers, even when the cards hide them. | Return only public display name, rating, text, date, and approved photo. |
| “Verified buyer” is not properly verified. | A customer without a qualifying purchase can receive the badge. | Check that the customer purchased that particular product before awarding the badge. |
| Edit/delete controls use incorrect ownership checks. | A hardcoded name rule can show controls to the wrong visitor. Backend checks are separate. | Use the signed-in account’s actual ownership. Remove name-based exceptions. |
| Old reviews can remain cached. | A deleted review still appears from browser storage. | Refresh from the server correctly, including when it returns no reviews. |
| Review photos are handled inefficiently. | Large photos are stored inside database text and returned with review data. | Store resized images separately and load reviews in pages. |

**Ideal flow:** purchase → delivery → review invitation → review → verified badge based on the actual order.

## 5. Contact, support, shipping, and returns

**The contact form currently does not send the message.**

Example: a customer requests cancellation, sees “Message Received,” and assumes you were informed. You receive nothing. This matters because the refund policy directs customers to that form.

Before launch:

- Connect the form to a reliable support inbox or ticket system.
- Show success only after the message is accepted.
- Display a working support email or WhatsApp link.
- Match cancellation and return instructions to your actual process.
- Finish restock notifications: requests are saved, but a complete alert-sending workflow was not found.
- Confirm actual courier serviceability and delivery estimates.

## 6. Admin panel

Dashboard, orders, inventory, catalog, product editor, and review moderation screens loaded during inspection.

| Needs updating | Why it matters |
|---|---|
| Revenue calculations | All order amounts are counted, including unpaid COD and cancelled orders. |
| Growth percentage | “+18% from last month” is hardcoded and appeared with zero revenue and orders. |
| Activity history | You need to know who changed prices, deducted stock, cancelled orders, or issued refunds. |
| Offline sales log | It lives in the browser’s storage, so it is not a reliable shared business record. |
| Order status rules | Prevent inappropriate status jumps and handle related stock/payment changes. |
| Admin protection | Add two-step verification and identity confirmation for sensitive actions. |

**Ideal dashboard:** show paid sales, pending COD, refunds, cancelled orders, and net revenue separately.

## 7. Database and customer information

Think of the database as the locked storeroom behind your shop.

The application uses a very powerful database account. All eight application tables have row-level security disabled. **This does not prove anyone can publicly read your database:** inspected permissions did not show anonymous read access. However, safeguards need improvement.

Required fixes:

- Give the application only the database permissions it needs.
- Verify the database server’s security certificate properly.
- Restrict direct access to private customer tables.
- Keep database upgrades separate from normal website startup.
- Secure backups and test restoring them.
- Remove sensitive database backups from ordinary source-code storage.

A tracked SQL backup contains sections for customer/account data and password hashes. Treat it as sensitive. The audit did not establish that it is publicly downloadable.

## 8. Design and typography

**Keep the visual direction:** dark background, gold accents, consistent branding, and fragrance-focused presentation.

**Provisional design rating: 7/10.** Improve readability and shopping clarity before adding decoration. A full mobile, contrast, and keyboard-accessibility pass remains necessary.

| Area | Improvement | Example |
|---|---|---|
| Small text | Increase essential text sizes, especially on mobile. | Make prices, delivery details, and instructions comfortably readable. |
| Widely spaced uppercase text | Reserve it for short labels. | “COLLECTION” works; a delivery explanation should use normal sentence case. |
| Contrast | Make important secondary text easier to see. | Stock status and validation errors should stand out against the background. |
| Font hierarchy | Give heading and body fonts clear roles. | Decorative headings, simple readable descriptions and checkout text. |
| Buttons | Make actions obvious and label icon-only controls. | “Add to cart,” “Save changes,” and “Edit product” should be clear. |
| Loading effects | Keep them brief and avoid blocking repeat navigation. | Help customers reach products quickly. |
| Reviews layout | Avoid making one review look like many independent reviews. | Use a simple static layout when there are only a few reviews. |

## 9. Images, duplicate files, and speed

Approximately **89.6 MiB of public assets** were found, including a **10.5 MiB perfume backup folder**. This does not mean every visitor downloads all of it.

Cleanup priorities:

- Compress oversized product images.
- Move backup images and contact sheets outside the public website.
- Remove unused demos and old assets after checking references.
- Consolidate duplicate logos and category images.
- Check ingredient images: many differently named notes use identical files.
- Fix the missing first hero-video source.
- Load admin code only when an admin visits those screens.

**Do not delete files just because they look unused.** References can come from the database or historical orders. The separate asset inventory lists candidates for checking, not an automatic deletion list.

## 10. Features: present, incomplete, and optional

| Feature | Assessment |
|---|---|
| Catalog, filters, sizes, cart | Present; stronger availability checks needed |
| Signup, login, password reset | Present; security changes required |
| Profile and order history | Present; ownership rules need fixing |
| Razorpay and COD | Present; payment integrity needs fixing |
| Admin catalog, inventory, orders | Present; operational controls incomplete |
| Reviews | Present; privacy and verification need fixing |
| Contact form | Present visually; message delivery missing |
| Restock alerts | Requests collected; sending workflow incomplete |
| Refunds and cancellations | Policies present; operational workflow incomplete |
| Admin two-step verification | Missing from inspected authentication flow |
| Durable admin activity log | Missing |
| Reliable payment reconciliation | Missing |
| Automated security/checkout tests | No test command configured |
| Wishlist, recommendations, loyalty | Optional later improvements |

A wishlist or coupon system can wait. **Secure accounts, correct payments, accurate stock, and working support cannot.**

## 11. What to do first

1. **Secure accounts and customer data:** close signup bypasses, remove automatic admin grants, fix order ownership and public review data.
2. **Secure money and stock:** bind payments to saved checkouts, stop duplicate orders, prevent overselling, implement refunds and COD reconciliation.
3. **Finish business functions:** contact delivery, restock alerts, admin logs, accurate reporting, complete policies and product information.
4. **Polish and verify:** typography, accessibility, speed, image cleanup, dependency updates, and realistic end-to-end tests.

## 12. Checks before customers arrive

- [ ] One customer cannot view or change another customer’s account, orders, or reviews.
- [ ] Ordinary customers cannot use any admin action.
- [ ] Signup requires verification; password resets invalidate old sessions.
- [ ] Payments match the exact order amount and cannot be reused.
- [ ] Closing the browser after payment does not lose the order.
- [ ] Two people cannot buy the same last unit.
- [ ] Cancellation, refunds, COD collection, and restocking work correctly.
- [ ] Contact messages and order emails reach a monitored destination.
- [ ] Products have accurate images, descriptions, prices, and actual stock.
- [ ] Business identity, support details, delivery and return policies are complete.
- [ ] Database access, image storage permissions, secrets, and backups are checked.
- [ ] Mobile, keyboard navigation, error messages, and slow connections are tested.
- [ ] Dependency updates are reviewed and tested. The scan found three high-severity packages.
- [ ] Build and lint pass. Build currently passes; lint currently reports 25 errors, which are not all security flaws.
- [ ] Monitoring and alerts are enabled, and someone owns support and incident response.

Hosting and payment dashboard settings, storage policies, backup restoration, and full cross-account integration tests still need verification. No audit can promise an attack-proof website.

**You do not need to throw the website away. Finish and verify the parts that protect customers and make the shop operate reliably.**
