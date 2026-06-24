import { Resend } from "resend";
import { FROM_EMAIL, TO_EMAIL, AUDIENCE_ID } from "@/lib/resend";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !/.+@.+\..+/.test(email)) {
    return Response.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "Email service is not configured yet." },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // If a Resend Audience is configured, add the subscriber to it.
  // Otherwise notify the owner by email so no signup is lost.
  if (AUDIENCE_ID) {
    const { error } = await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });
    if (error) {
      return Response.json({ error: "Could not subscribe." }, { status: 502 });
    }
  } else {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "New newsletter subscriber",
      text: `New subscriber: ${email}`,
    });
    if (error) {
      return Response.json({ error: "Could not subscribe." }, { status: 502 });
    }
  }

  return Response.json({ ok: true });
}
