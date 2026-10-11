"use client";

import { useState } from "react";

type UrlMode = "encode" | "decode";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<UrlMode>("encode");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  function processUrl(nextMode: UrlMode) {
    setMode(nextMode);
    setError("");
    setOutput("");
    setCopyMessage("");

    if (!input) {
      setError("Please enter text or a URL first.");
      return;
    }

    try {
      const result =
        nextMode === "encode"
          ? encodeURIComponent(input)
          : decodeURIComponent(input);

      setOutput(result);
    } catch {
      setError(
        "Unable to decode this input. Check that the encoded URL or text is valid.",
      );
    }
  }

  async function handleCopy() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopyMessage("Result copied to clipboard.");
    } catch {
      setCopyMessage("Copy failed. Please select and copy the result manually.");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
    setCopyMessage("");
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <label
          htmlFor="url-input"
          className="mb-3 block font-semibold text-[var(--foreground)]"
        >
          Enter text or URL
        </label>

        <textarea
          id="url-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setOutput("");
            setError("");
            setCopyMessage("");
          }}
          placeholder="Enter a URL, query parameter, or text..."
          rows={6}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-6 text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => processUrl("encode")}
            className={`rounded-lg px-5 py-2.5 font-semibold transition ${
              mode === "encode"
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-50"
            }`}
          >
            Encode
          </button>

          <button
            type="button"
            onClick={() => processUrl("decode")}
            className={`rounded-lg px-5 py-2.5 font-semibold transition ${
              mode === "decode"
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-50"
            }`}
          >
            Decode
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 font-semibold text-[var(--foreground)] hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--foreground)]">Result</h2>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy Result
          </button>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        ) : (
          <pre className="min-h-32 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-6 text-[var(--foreground)]">
            {output || "Your result will appear here."}
          </pre>
        )}

        <p aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">
          {copyMessage}
        </p>
      </section>

      <p className="text-sm leading-6 text-[var(--muted)]">
        Processing happens locally in your browser. Your input is not uploaded to
        the Jodchha server. This tool uses component encoding for text and query
        values; it does not encode an entire URL according to every URL-specific
        rule.
      </p>
    </div>
  );
}
