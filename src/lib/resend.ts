// Resend configuration. The client itself is created inside each route handler
// after the API key is verified, so a missing key never breaks module loading.

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Poyraz Site <onboarding@resend.dev>";

export const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "eyup@poyraz.co";

export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
