"use client";

import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const trimmedText = text.trim();
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0;

  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmedText
    ? (trimmedText.match(/[.!?]+(?=\s|$)/g) ?? []).length
    : 0;
  const paragraphs = trimmedText
    ? trimmedText.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;
  const readingTime = Math.ceil(words / 200);

  async function handleCopy() {
    if (!text) {
      setCopyMessage("Enter some text first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Text copied!");
    } catch {
      setCopyMessage("Unable to copy. Please select and copy the text.");
    }
  }

  function handleClear() {
    setText("");
    setCopyMessage("");
  }

  const stats = [
    { label: "Words", value: words },
    { label: "Characters", value: characters },
    { label: "Without spaces", value: charactersWithoutSpaces },
    { label: "Sentences", value: sentences },
    { label: "Paragraphs", value: paragraphs },
    {
      label: "Reading time",
      value: words === 0 ? "0 min" : `${readingTime} min`,
    },
  ];

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <label
          htmlFor="word-counter-input"
          className="mb-3 block font-semibold text-[var(--foreground)]"
        >
          Enter or paste your text
        </label>

        <textarea
          id="word-counter-input"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setCopyMessage("");
          }}
          placeholder="Start typing or paste your text here..."
          rows={12}
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-[var(--muted)]">
            {copyMessage || "Your statistics update as you type."}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Copy Text
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--white)] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            <p className="mt-2 break-words text-2xl font-bold text-[var(--foreground)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm leading-6 text-[var(--muted)]">
        Reading time is an estimate based on 200 words per minute. Your text is
        processed in your browser and is not uploaded to the Jodchha server.
      </p>
    </div>
  );
}
