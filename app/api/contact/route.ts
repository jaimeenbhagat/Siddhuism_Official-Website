import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO_EMAIL;

    if (!host || !user || !pass || !to) {
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `siddhuism_official <${user}>`,
      to,
      replyTo: body.email,
      subject: `New enquiry from ${body.name}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
      html: `<p><strong>Name:</strong> ${body.name}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Message:</strong><br/>${body.message}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send email." }, { status: 500 });
  }
}
