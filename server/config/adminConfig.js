/**
 * Administrator Configuration & Email Resolution Helper
 * 
 * Supports both ADMIN_EMAIL (singular) and ADMIN_EMAILS (plural, comma-separated),
 * resolving environment variable inconsistencies across authentication, admin
 * initialization, and notification dispatchers.
 */

export const getAdminEmails = () => {
  const raw = `${process.env.ADMIN_EMAILS || ""},${process.env.ADMIN_EMAIL || ""}`;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

export const getPrimaryAdminEmail = () => {
  const emails = getAdminEmails();
  return emails[0] || "thedecantbarofficial@gmail.com";
};

export const isConfiguredAdminEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
};

