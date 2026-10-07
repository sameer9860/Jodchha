"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#discover", label: "Discover" },
    { href: "/tools", label: "Tools" },
    { href: "#categories", label: "Categories" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--white)]/90 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[var(--foreground)]"
          >
            Jodchha
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="#discover"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Explore
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] p-2 text-[var(--foreground)] md:hidden"
          >
            <span className="sr-only">Open menu</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-[var(--border)] bg-[var(--white)] py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="#discover"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Explore
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
