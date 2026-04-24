import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { PostgrestError } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
};

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 32;
const MAX_MESSAGE_LENGTH = 4000;
const OWNER_EMAIL = "siddhuism.official@gmail.com";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^[0-9+\-()\s]{7,20}$/.test(phone);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    return {
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      }),
      fromUser: emailUser,
      toAddress: OWNER_EMAIL,
    };
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("Email service is not configured.");
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    }),
    fromUser: user,
    toAddress: OWNER_EMAIL,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const phone = normalizeText(body.phone);
    const message = normalizeText(body.message);

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (
      name.length > MAX_NAME_LENGTH
      || email.length > MAX_EMAIL_LENGTH
      || phone.length > MAX_PHONE_LENGTH
      || message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Input is too long. Please shorten your submission." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error: insertErrorWithPhone } = await supabase.from("contact_submissions").insert([
      { name, email, phone, message },
    ]);

    let insertError: PostgrestError | null = insertErrorWithPhone;

    // Backward-compat fallback: if DB doesn't have phone column yet, retry without it.
    if (insertError?.code === "42703" && insertError.message.toLowerCase().includes("phone")) {
      const { error: retryInsertError } = await supabase.from("contact_submissions").insert([
        { name, email, message },
      ]);
      insertError = retryInsertError;
    }

    if (insertError) {
      if (insertError.code === "42P01") {
        return NextResponse.json(
          { error: "Database table not found. Please run supabase/contact_submissions.sql." },
          { status: 500 },
        );
      }

      if (insertError.code === "42501") {
        return NextResponse.json(
          { error: "Database permission/policy issue. Please verify RLS policy and grants." },
          { status: 500 },
        );
      }

      return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
    }

    const { transporter, fromUser, toAddress } = getTransporter();

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");


    await transporter.sendMail({
      from: `siddhuism_official <${fromUser}>`,
      to: toAddress,
      replyTo: email,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <h2>New Inquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong><br/>${safeMessage}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process contact request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
