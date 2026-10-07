import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://jodchha.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Jodchha — Useful Websites, Tools & Online Services",
    template: "%s | Jodchha",
  },

  description:
    "Discover useful websites, online services, and free tools in one simple place.",

  keywords: [
    "Jodchha",
    "useful websites",
    "online tools",
    "web directory",
    "URL shortener",
    "QR code generator",
    "Nepal websites",
    "online services",
  ],

  authors: [{ name: "Jodchha" }],
  creator: "Jodchha",
  publisher: "Jodchha",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "Jodchha",
    title: "Jodchha — Useful Websites, Tools & Online Services",
    description:
      "Discover useful websites, online services, and free tools in one simple place.",
    url: siteUrl,
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Jodchha — Useful Websites, Tools & Online Services",
    description:
      "Discover useful websites, online services, and free tools in one simple place.",
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}