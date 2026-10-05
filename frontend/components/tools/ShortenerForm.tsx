"use client";

import { FormEvent, useState } from "react";

import {
  createShortLink,
  getShortLinkUrl,
} from "@/lib/api";

export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setShortUrl("");
    setCopied(false);
    setLoading(true);

    try {
      const result = await createShortLink(url.trim());
      setShortUrl(getShortLinkUrl(result.code));
    } catch {
      setError("Unable to create the short link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) {
      return;
    }

    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="url"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Enter your URL
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/very-long-url"
            required
            className="h-12 flex-1 rounded-lg border border-[var(--border)] px-4 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-lg bg-[var(--primary)] px-6 font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Shorten URL"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {shortUrl && (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-slate-50 p-4">
          <p className="text-sm font-medium text-[var(--muted)]">
            Your shortened URL
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 break-all rounded-lg bg-[var(--white)] px-4 py-3 font-semibold text-[var(--primary)]"
            >
              {shortUrl}
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--white)]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
