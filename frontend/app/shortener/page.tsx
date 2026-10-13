import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "URL Shortener",
  description:
    "Create short, shareable URLs with Jodchha's free URL shortener.",
  alternates: {
    canonical: "/tools/shortener",
  },
};

export default function ShortenerRedirectPage() {
  redirect("/tools/shortener");
}
