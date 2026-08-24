"use client";

import { useState } from "react";
import { submitInquiry, type InquiryFormData } from "@/app/actions";

export default function InquirePage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const data: InquiryFormData = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string || undefined,
      country: fd.get("country") as string || undefined,
      arrivalDate: fd.get("arrivalDate") as string || undefined,
      departureDate: fd.get("departureDate") as string || undefined,
      adults: Number(fd.get("adults")) || 2,
      children: Number(fd.get("children")) || 0,
      safariType: fd.get("safariType") as string || undefined,
      message: fd.get("message") as string || undefined,
    };

    const result = await submitInquiry(data);

    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <>
        <section className="relative bg-charcoal py-24">
          <div className="container-main">
            <h1 className="text-warm-white">Plan My Safari</h1>
            <div className="divider-editorial" />
          </div>
        </section>
        <section className="bg-warm-white py-[var(--spacing-section)]">
          <div className="container-main text-center">
            <div className="mx-auto max-w-lg">
              <span className="text-5xl">✓</span>
              <h2 className="mt-6 font-display text-3xl font-bold text-charcoal">Thank You!</h2>
              <p className="mt-4 font-body text-lg text-charcoal-light">
                We&apos;ve received your inquiry and will get back to you within 24 hours
                with a personalized safari proposal.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="btn-primary mt-8"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative bg-charcoal py-24">
        <div className="container-main">
          <h1 className="text-warm-white">Plan My Safari</h1>
          <div className="divider-editorial" />
          <p className="mt-4 max-w-2xl font-body text-cream-dark">
            Looking for a quote? Fill out the form below with your travel plans and dates.
            We&apos;ll get back to you within 24 hours with the best possible quote.
          </p>
        </div>
      </section>

      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="mx-auto max-w-2xl">
            {status === "error" && (
              <div className="mb-6 rounded border border-red-300 bg-red-50 p-4 font-body text-sm text-red-800">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Your Name *</label>
                  <input name="name" type="text" required className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Your Email *</label>
                  <input name="email" type="email" required className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Phone Number</label>
                  <input name="phone" type="tel" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Country</label>
                  <select name="country" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta">
                    <option value="">Select your country</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Australia</option>
                    <option>Canada</option>
                    <option>Netherlands</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Arrival Date</label>
                  <input name="arrivalDate" type="date" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Departure Date</label>
                  <input name="departureDate" type="date" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Adults</label>
                  <input name="adults" type="number" min={1} max={100} defaultValue={2} className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal">Children</label>
                  <input name="children" type="number" min={0} max={100} defaultValue={0} className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-charcoal">Safari/Tour Type</label>
                <select name="safariType" className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta">
                  <option value="">Select a type</option>
                  <option value="wildlife">Wildlife Safari</option>
                  <option value="trekking">Mountain Trekking</option>
                  <option value="cultural">Cultural Tours</option>
                  <option value="beach">Beach Holiday</option>
                  <option value="multiple">Multiple Activities</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-charcoal">
                  Other Details or Special Requirements
                </label>
                <textarea name="message" rows={5} className="mt-1 w-full rounded border border-cream-dark bg-warm-white px-4 py-3 font-body text-charcoal outline-none focus:border-terracotta" />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
              </button>

              <p className="text-center font-body text-xs text-charcoal-light">
                By submitting this form, you accept our privacy policy and agree with our terms and conditions.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
