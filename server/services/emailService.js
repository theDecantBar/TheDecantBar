import { Resend } from "resend";

export async function sendEmail({ to, subject, html, text, replyTo, reply_to }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing. Check your .env file.");
  }

  if (!from) {
    throw new Error("EMAIL_FROM is missing. Check your .env file.");
  }

  const resend = new Resend(apiKey);

  const payload = {
    from,
    to,
    subject,
    html,
    text,
  };

  const resolvedReplyTo = replyTo || reply_to;
  if (resolvedReplyTo) {
    payload.reply_to = resolvedReplyTo;
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    const err = new Error(error.message || "Resend could not send the email.");
    err.name = error.name || "ResendError";
    err.statusCode = error.statusCode || 500;
    throw err;
  }

  return data;
}
