"use client";

import { useState } from "react";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "alternating";

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();

    case "lower":
      return text.toLowerCase();

    case "title":
      return text.toLowerCase().replace(
        /(^|[\s\-–—]+)([^\s\-–—])/g,
        (_, separator: string, character: string) =>
          separator + character.toUpperCase(),
      );

    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) =>
          match.toUpperCase(),
        );

    case "alternating": {
      let uppercaseNext = true;

      return Array.from(text)
        .map((character) => {
          if (!/\p{L}/u.test(character)) return character;

          const result = uppercaseNext
            ? character.toUpperCase()
            : character.toLowerCase();

          uppercaseNext = !uppercaseNext;
          return result;
        })
        .join("");
    }
  }
}

const cases: { label: string; value: CaseType }[] = [
  { label: "UPPERCASE", value: "upper" },
  { label: "lowercase", value: "lower" },
  { label: "Title Case", value: "title" },
  { label: "Sentence case", value: "sentence" },
  { label: "aLtErNaTiNg CaSe", value: "alternating" },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  function handleConvert(type: CaseType) {
    setOutput(convertCase(input, type));
    setMessage("");
  }

  async function handleCopy() {
    if (!output) {
      setMessage("Enter some text and choose a case first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setMessage("Converted text copied!");
    } catch {
      setMessage("Copy failed. Please select and copy the output.");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setMessage("");
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <label
          htmlFor="case-input"
          className="mb-3 block font-semibold text-[var(--foreground)]"
        >
          Enter your text
        </label>

        <textarea
          id="case-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setOutput("");
            setMessage("");
          }}
          rows={7}
          placeholder="Paste or type your text here..."
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 leading-7 text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-2 text-sm text-[var(--muted)]">{input.length} characters</p>

        <div className="mt-5 flex flex-wrap gap-3">
          {cases.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleConvert(item.value)}
              className="rounded-lg bg-[var(--primary)] px-4 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--foreground)]">Converted text</h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50 disabled:opacity-50"
            >
              Copy
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          aria-label="Converted text"
          value={output}
          readOnly
          rows={7}
          placeholder="Your converted text will appear here..."
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 leading-7 text-[var(--foreground)]"
        />

        <p aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">
          {message}
        </p>
      </section>

      <p className="text-sm leading-6 text-[var(--muted)]">
        Text conversion happens in your browser. Your text is not uploaded to the
        Jodchha server.
      </p>
    </div>
  );
}
