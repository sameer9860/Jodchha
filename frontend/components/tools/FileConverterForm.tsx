"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

const validTypes = ["image/png", "image/jpeg", "image/webp"] as const;
const maxFileSize = 10 * 1024 * 1024;

export default function FileConverterForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [outputType, setOutputType] = useState<(typeof validTypes)[number]>("image/png");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    return () => {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }

      if (convertedUrl) {
        URL.revokeObjectURL(convertedUrl);
      }
    };
  }, [sourceUrl, convertedUrl]);

  function handleFileSelection(file: File | null) {
    if (!file) {
      return;
    }

    if (!validTypes.includes(file.type as (typeof validTypes)[number])) {
      setError("Unsupported file type. Please upload a PNG, JPEG, or WebP image.");
      setSelectedFile(null);
      setConvertedUrl("");
      return;
    }

    if (file.size > maxFileSize) {
      setError("File is too large. Please upload an image smaller than 10 MB.");
      setSelectedFile(null);
      setConvertedUrl("");
      return;
    }

    setError("");

    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
    }

    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }

    const nextSourceUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setSourceUrl(nextSourceUrl);
    setConvertedUrl("");
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    handleFileSelection(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  }

  function handleConvert() {
    if (!selectedFile || !sourceUrl) {
      setError("Please upload an image before converting.");
      return;
    }

    setError("");
    setIsConverting(true);

    const image = new window.Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        setError("This browser could not process the image. Please try again.");
        setIsConverting(false);
        return;
      }

      if (outputType === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Conversion failed. Please try another image.");
            setIsConverting(false);
            return;
          }

          if (convertedUrl) {
            URL.revokeObjectURL(convertedUrl);
          }

          setConvertedUrl(URL.createObjectURL(blob));
          setIsConverting(false);
        },
        outputType,
        0.92,
      );
    };

    image.onerror = () => {
      setError("Could not read this image. Please try a different file.");
      setIsConverting(false);
    };

    image.src = sourceUrl;
  }

  function handleDownload() {
    if (!convertedUrl) {
      return;
    }

    const extension = outputType.split("/")[1] || "png";
    const baseName =
      selectedFile?.name.replace(/\.[^/.]+$/, "") || "converted-image";

    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = `${baseName}.${extension}`;
    link.click();
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 shadow-sm">
      <div
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? "border-[var(--primary)] bg-blue-50"
            : "border-[var(--border)] bg-slate-50"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />

        <p className="text-lg font-semibold text-[var(--foreground)]">
          Upload an image
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Drag and drop a PNG, JPEG, or WebP file here, or click to browse.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Choose File
        </button>
      </div>

      {selectedFile && (
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Selected File
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {selectedFile.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Convert to
            </label>
            <select
              value={outputType}
              onChange={(event) => setOutputType(event.target.value as (typeof validTypes)[number])}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {selectedFile && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleConvert}
            disabled={isConverting}
            className="rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConverting ? "Converting..." : "Convert Image"}
          </button>

          {convertedUrl && (
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
            >
              Download Converted File
            </button>
          )}
        </div>
      )}

      {selectedFile && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Original Image
            </p>
            <div className="mt-4 overflow-hidden rounded-lg bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sourceUrl}
                alt="Original uploaded preview"
                className="max-h-80 w-full rounded-lg object-contain"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Converted Result
            </p>
            {convertedUrl ? (
              <div className="mt-4 overflow-hidden rounded-lg bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={convertedUrl}
                  alt="Converted preview"
                  className="max-h-80 w-full rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="mt-4 flex min-h-52 items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-white p-4 text-sm text-[var(--muted)]">
                Converted image preview will appear here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
