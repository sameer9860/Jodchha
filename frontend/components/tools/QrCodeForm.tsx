"use client";

import { FormEvent, useState } from "react";
import QRCode from "qrcode";

export default function QrCodeForm() {
  const [value, setValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Please enter a URL or text.");
      setQrCode("");
      return;
    }

    try {
      setError("");

      const dataUrl = await QRCode.toDataURL(trimmedValue, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: "M",
      });

      setQrCode(dataUrl);
    } catch {
      setError("Unable to generate the QR code. Please try again.");
      setQrCode("");
    }
  }

  function handleDownload() {
    if (!qrCode) {
      return;
    }

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "jodchha-qr-code.png";
    link.click();
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="qr-value"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Enter URL or text
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="qr-value"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://example.com"
            className="h-12 flex-1 rounded-lg border border-[var(--border)] px-4 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="h-12 rounded-lg bg-[var(--primary)] px-6 font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Generate QR
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      {qrCode && (
        <div className="mt-8 flex flex-col items-center rounded-xl border border-[var(--border)] bg-slate-50 p-6">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Your QR Code
          </p>

          <div className="mt-5 rounded-xl bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCode}
              alt="Generated QR code"
              width={320}
              height={320}
            />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="mt-5 rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}
