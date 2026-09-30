import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jodchha — Connect. Discover. Go.",
    template: "%s | Jodchha",
  },
  description:
    "Discover useful websites, online services, and tools with Jodchha.",
  keywords: [
    "Jodchha",
    "web directory",
    "online tools",
    "useful websites",
    "Nepal websites",
  ],
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