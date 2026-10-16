
import { Resend } from "resend";

export async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing. Check your .env file.");
  }

  if (!from) {
    throw new Error("EMAIL_FROM is missing. Check your .env file.");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Resend error:", error.message);
    throw new Error("Resend could not send the email.");
  }

  return data;
}
