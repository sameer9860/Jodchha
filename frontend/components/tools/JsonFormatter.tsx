"use client";

import { useState } from "react";

type FormatMode = "pretty" | "minify";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<FormatMode>("pretty");
  const [copyMessage, setCopyMessage] = useState("");

  function processJson(nextMode: FormatMode = mode) {
    setError("");
    setOutput("");
    setCopyMessage("");

    if (!input.trim()) {
      setError("Please enter some JSON to format.");
      return;
    }

    try {
      const parsed: unknown = JSON.parse(input);
      const result =
        nextMode === "pretty"
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed);

      setMode(nextMode);
      setOutput(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Invalid JSON: ${err.message}`
          : "Invalid JSON. Please check your input.",
      );
    }
  }

  async function handleCopy() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopyMessage("Formatted JSON copied!");
    } catch {
      setCopyMessage("Copy failed. Please select and copy the output manually.");
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
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5">
          <label
            htmlFor="json-input"
            className="mb-3 block font-semibold text-[var(--foreground)]"
          >
            Input JSON
          </label>

          <textarea
            id="json-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
              setOutput("");
              setCopyMessage("");
            }}
            placeholder={'Paste JSON here, e.g. {"name":"Jodchha"}'}
            spellCheck={false}
            rows={15}
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-6 text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => processJson("pretty")}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              Format JSON
            </button>

            <button
              type="button"
              onClick={() => processJson("minify")}
              className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] hover:bg-slate-50"
            >
              Minify JSON
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-[var(--foreground)]">Output</h2>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy Output
            </button>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          ) : (
            <pre className="min-h-[360px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-6 text-[var(--foreground)]">
              {output || "Your formatted JSON will appear here."}
            </pre>
          )}

          <p aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">
            {copyMessage}
          </p>
        </section>
      </div>

      <p className="text-sm leading-6 text-[var(--muted)]">
        Your JSON is processed locally in your browser and is not uploaded to the
        Jodchha server.
      </p>
    </div>
  );
}
