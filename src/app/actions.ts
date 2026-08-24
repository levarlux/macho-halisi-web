"use server";

import { client } from "@/lib/sanity/client";

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  arrivalDate?: string;
  departureDate?: string;
  adults?: number;
  children?: number;
  safariType?: string;
  message?: string;
  source?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface FormResult {
  success: boolean;
  error?: string;
}

export async function submitInquiry(data: InquiryFormData): Promise<FormResult> {
  try {
    if (!data.name || !data.email) {
      return { success: false, error: "Name and email are required." };
    }

    await client.create({
      _type: "inquiry",
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      country: data.country || undefined,
      arrivalDate: data.arrivalDate || undefined,
      departureDate: data.departureDate || undefined,
      adults: data.adults || 2,
      children: data.children || 0,
      safariType: data.safariType || undefined,
      message: data.message || undefined,
      source: data.source || "website-inquire",
      status: "new",
    });

    return { success: true };
  } catch (err) {
    console.error("Inquiry submission failed:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function submitContact(data: ContactFormData): Promise<FormResult> {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "Name, email, and message are required." };
    }

    await client.create({
      _type: "inquiry",
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      message: `[Contact Form] ${data.subject ? data.subject + "\n\n" : ""}${data.message}`,
      source: "website-contact",
      status: "new",
    });

    return { success: true };
  } catch (err) {
    console.error("Contact submission failed:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
