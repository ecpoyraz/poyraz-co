import { Resend } from "resend";
import { FROM_EMAIL, TO_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!email || !message) {
    return Response.json(
      { error: "Email and message are required." },
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
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `New message from ${name || email} via poyraz.co`,
    text: `Name: ${name || "-"}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    return Response.json({ error: "Could not send message." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
