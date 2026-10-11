"use client";

import { useState } from "react";

function generateSecurePassword(
  length: number,
  characters: string,
): string {
  if (!characters) {
    throw new Error("Select at least one character type.");
  }

  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new Error("Secure random generation is unavailable in this browser.");
  }

  const randomIndex = (max: number): number => {
    const limit = Math.floor(256 / max) * max;
    const buffer = new Uint8Array(1);
    let value: number;

    do {
      cryptoApi.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);

    return value % max;
  };

  let password = "";
  for (let i = 0; i < length; i += 1) {
    password += characters[randomIndex(characters.length)];
  }

  return password;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleGenerate() {
    let characters = "";

    if (uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) characters += "0123456789";
    if (symbols) characters += "!@#$%^&*()-_=+[]{};:,.?";

    setError("");
    setMessage("");

    if (!characters) {
      setPassword("");
      setError("Select at least one character type.");
      return;
    }

    try {
      setPassword(generateSecurePassword(length, characters));
    } catch {
      setPassword("");
      setError("Unable to generate a secure password in this browser.");
    }
  }

  async function handleCopy() {
    if (!password) {
      setMessage("Generate a password first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setMessage("Password copied to clipboard.");
    } catch {
      setMessage("Copy failed. Please select and copy the password manually.");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <label
          htmlFor="password-length"
          className="flex items-center justify-between gap-4 font-semibold text-[var(--foreground)]"
        >
          Password length
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-lg">
            {length}
          </span>
        </label>

        <input
          id="password-length"
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
          className="mt-5 w-full accent-[var(--primary)]"
        />

        <div className="mt-2 flex justify-between text-sm text-[var(--muted)]">
          <span>8 characters</span>
          <span>64 characters</span>
        </div>

        <fieldset className="mt-8">
          <legend className="mb-4 font-semibold text-[var(--foreground)]">
            Include character types
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(event) => setUppercase(event.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="text-[var(--foreground)]">
                Uppercase letters (A–Z)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(event) => setLowercase(event.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="text-[var(--foreground)]">
                Lowercase letters (a–z)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(event) => setNumbers(event.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="text-[var(--foreground)]">
                Numbers (0–9)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(event) => setSymbols(event.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="text-[var(--foreground)]">
                Symbols (!@#$...)
              </span>
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-6 w-full rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Generate Password
        </button>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-5 sm:p-7">
        <h2 className="font-semibold text-[var(--foreground)]">Your password</h2>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            aria-label="Generated password"
            value={password}
            readOnly
            placeholder="Generate a password to see it here"
            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-sm text-[var(--foreground)]"
          />

          <button
            type="button"
            onClick={handleCopy}
            disabled={!password}
            className="rounded-xl border border-[var(--border)] px-5 py-3 font-semibold text-[var(--foreground)] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy Password
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <p aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">
          {message}
        </p>

        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Passwords are generated in your browser. Jodchha does not upload or
          store the generated password. For sensitive accounts, use a trusted
          password manager.
        </p>
      </section>
    </div>
  );
}
