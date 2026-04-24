"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/section-heading";
import Toast from "@/components/ui/toast";

type ToastState = {
  type: "success" | "error" | null;
  message: string;
};

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ type: null, message: "" });

  useEffect(() => {
    if (!toast.type) {
      return;
    }

    const timeout = setTimeout(() => {
      setToast({ type: null, message: "" });
    }, 2800);

    return () => clearTimeout(timeout);
  }, [toast]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Request failed");
      }

      form.reset();
      setToast({ type: "success", message: "Message sent successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send message. Try again.";
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Contact"
          title="Ready for collaborations and creative campaigns"
          description="Send an enquiry and get a response via email workflow powered by Next.js API routes."
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          onSubmit={onSubmit}
          className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-6 backdrop-blur-xl md:p-10"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Name
              <input
                type="text"
                name="name"
                required
                className="mt-2 w-full rounded-xl border border-slate-700/80 bg-slate-900/85 px-4 py-3 text-slate-100 outline-none focus:border-blue-300/60"
                placeholder="Your name"
              />
            </label>

            <label className="text-sm text-slate-300">
              Email
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-xl border border-slate-700/80 bg-slate-900/85 px-4 py-3 text-slate-100 outline-none focus:border-blue-300/60"
                placeholder="you@example.com"
              />
            </label>

            <label className="text-sm text-slate-300 md:col-span-2">
              Phone Number
              <input
                type="tel"
                name="phone"
                required
                className="mt-2 w-full rounded-xl border border-slate-700/80 bg-slate-900/85 px-4 py-3 text-slate-100 outline-none focus:border-blue-300/60"
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm text-slate-300">
            Message
            <textarea
              name="message"
              required
              rows={5}
              className="mt-2 w-full rounded-xl border border-slate-700/80 bg-slate-900/85 px-4 py-3 text-slate-100 outline-none focus:border-blue-300/60"
              placeholder="Tell me about your project"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-full bg-linear-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Enquiry"}
          </button>
        </motion.form>
      </div>

      <Toast type={toast.type} message={toast.message} />
    </section>
  );
}
