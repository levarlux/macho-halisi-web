"use client";

import { useState } from "react";
import { submitContact, type ContactFormData } from "@/app/actions";

export default function ContactsPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const data: ContactFormData = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string || undefined,
      subject: fd.get("subject") as string || undefined,
      message: fd.get("message") as string,
    };

    const result = await submitContact(data);

    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong.");
    }
  }

  return (
    <>
      <section className="relative bg-charcoal py-24">
        <div className="container-main">
          <h1 className="text-warm-white">Contact Us</h1>
          <div className="divider-editorial" />
        </div>
      </section>

      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info */}
            <div>
              <h2 className="section-heading text-2xl">Macho Halisi (T) Ltd</h2>
              <div className="mt-6 space-y-4 font-body text-charcoal-light">
                <p>
                  <strong className="text-charcoal">Location:</strong><br />
                  Karatu, Arusha – Tanzania
                </p>
                <p>
                  <strong className="text-charcoal">Phone:</strong><br />
                  <a href="tel:+255789718505" className="hover:text-terracotta">+255 789 718 505</a><br />
                  <a href="tel:+255754474792" className="hover:text-terracotta">+255 754 474 792</a>
                </p>
                <p>
                  <strong className="text-charcoal">Email:</strong><br />
                  <a href="mailto:info@machohalisi.com" className="hover:text-terracotta">
                    info@machohalisi.com
                  </a>
                </p>
              </div>

              <div className="mt-8 rounded bg-cream p-6">
                <h3 className="font-display text-lg font-semibold text-charcoal">Office Hours</h3>
                <p className="mt-2 font-body text-charcoal-light">
                  Monday – Friday: 8:00 AM – 5:00 PM (EAT)<br />
                  Saturday: 9:00 AM – 1:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="section-heading text-2xl">Send a Message</h2>
              <div className="divider-editorial" />

              {status === "success" ? (
                <div className="mt-6 rounded bg-cream p-8 text-center">
                  <span className="text-4xl">✓</span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-charcoal">Message Sent!</h3>
                  <p className="mt-2 font-body text-charcoal-light">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-primary mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  {status === "error" && (
                    <div className="mb-6 rounded border border-red-300 bg-red-50 p-4 font-body text-sm text-red-800">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block font-body text-sm font-medium text-charcoal">Your Name *</label>
                      <input name="name" type="text" required className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-charcoal">Your Email *</label>
                      <input name="email" type="email" required className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-charcoal">Phone Number</label>
                      <input name="phone" type="tel" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-charcoal">Subject</label>
                      <input name="subject" type="text" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-charcoal">Your Message *</label>
                      <textarea name="message" required rows={5} className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
