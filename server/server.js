
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// A persistent local server can check frequently. Vercel uses the protected scheduled endpoint.
if (process.env.PAYMENT_RECOVERY_ENABLED === "true" && !process.env.VERCEL) {
  const { recoverPayments } = await import("./services/paymentRecovery.js");
  let running = false;
  const timer = setInterval(async () => {
    if (running) return;
    running = true;
    try {
      await app.locals.schemaReady;
      await recoverPayments();
    } catch (error) {
      console.warn("Payment recovery:", error.message);
    } finally {
      running = false;
    }
  }, 60000);
  timer.unref();
}
