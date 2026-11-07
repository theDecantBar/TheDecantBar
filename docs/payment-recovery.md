# Payment recovery and deployment

Keep Razorpay test keys until the owner has an activated account and the deployed test checkout has passed verification.

## What recovery does

The webhook remains the immediate payment confirmation path. A scheduled fallback checks Razorpay directly for missed payments. Both paths lock the saved order before confirming it, so overlapping notifications do not deduct stock twice. A captured payment whose stock is no longer available is recorded as paid with `Stock review`; the owner must arrange fulfillment or refund it in Razorpay. Do not ask that customer to pay again.

The worker checks up to 20 eligible orders per run within a 35-second work budget. It records progress and leases each order for five minutes, allowing interrupted checks to resume. Test and live orders are separated by their saved mode; older unlabelled orders are labelled only after a successful provider lookup. Recent paid orders are also checked for refunds for 180 days. Older refunds can be refreshed using the admin payment-check button. Refund checks never restock returned goods automatically.

## Local use

Set `PAYMENT_RECOVERY_ENABLED=true` in the server environment and restart the backend to run checks every minute. This modifies the database configured for that backend, so use a test database for automated experiments. It is disabled by default. No tunnel is needed for this polling fallback; incoming webhooks still need a public URL.

## Vercel setup after pushing

1. Add a long random secret as `CRON_SECRET` in the target Vercel environment. This is separate from the Razorpay webhook secret. Never prefix it with `VITE_` or place it in browser code.
2. Deploy the updated code with the matching Razorpay keys and database configuration.
3. The included Vercel schedule runs daily on production deployments, compatible with Hobby. Preview deployments do not run Vercel cron automatically. Daily recovery is a fallback, not immediate confirmation; a large backlog can take multiple runs. Use a supported more frequent scheduler if quicker fallback recovery is required.
4. Configure Razorpay's webhook at `https://YOUR-DEPLOYED-DOMAIN/api/orders/razorpay-webhook`, using the exact same `RAZORPAY_WEBHOOK_SECRET` as that server. Subscribe to `payment.captured` and `payment.failed`.
5. Verify the webhook can reach the deployment without a Vercel login screen. Complete a Test Mode checkout, close the customer page before it returns, and confirm the original order becomes Paid in admin with one stock deduction.
6. Verify the scheduled job in Vercel logs. Its endpoint is `GET /api/jobs/payment-recovery` and requires `Authorization: Bearer <CRON_SECRET>`. A successful run returns counts; failures remain retryable and appear on the admin order.

Do not switch to live keys based only on the automated tests. Deployed webhook delivery and the scheduler must still be checked.

## Verification performed locally

`node --test tests/paymentCheckout.test.mjs` covers payment verification, retry, replay, server pricing and refund reconciliation with mocked dependencies.

`PAYMENT_POSTGRES_TEST=true node tests/paymentConcurrency.postgres.test.mjs` (set the environment variable using your shell) uses an isolated PostgreSQL instance on localhost port 55439, user `payment_test`, database `postgres`, without SSL. It creates and drops its own random schema. Razorpay responses are simulated; no real charges are made. It tests competing buyers, duplicate Pay clicks, COD versus online stock, opposite basket ordering, webhook/recovery overlap, provider outage recovery, late payments, job authentication, mode separation and interrupted-worker recovery. It never uses the shop's configured database connection.

Type checking and the frontend production build also pass. Email delivery and external webhook delivery are not covered by these isolated tests.
