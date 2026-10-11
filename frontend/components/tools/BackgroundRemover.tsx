"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

const validTypes = ["image/png", "image/jpeg", "image/webp"] as const;
const maxFileSize = 10 * 1024 * 1024;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAverageColorFromEdges(imageData: ImageData) {
  const { data, width, height } = imageData;
  const sampleSize = 16;
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  for (let y = 0; y < height; y += sampleSize) {
    for (let x = 0; x < width; x += sampleSize) {
      const nearEdge =
        x < sampleSize ||
        y < sampleSize ||
        x > width - sampleSize ||
        y > height - sampleSize;

      if (!nearEdge) {
        continue;
      }

      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      if (alpha === 0) {
        continue;
      }

      totalR += data[index];
      totalG += data[index + 1];
      totalB += data[index + 2];
      count += 1;
    }
  }

  if (count === 0) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  };
}

export default function BackgroundRemover() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(18);

  useEffect(() => {
    return () => {
      if (originalUrl) {
        URL.revokeObjectURL(originalUrl);
      }

      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
      }
    };
  }, [originalUrl, processedUrl]);

  function resetPreviewState() {
    setProcessedUrl("");
    setSelectedFile(null);
    setError("");
  }

  function handleFileSelection(file: File | null) {
    if (!file) {
      return;
    }

    if (!validTypes.includes(file.type as (typeof validTypes)[number])) {
      resetPreviewState();
      setError("Unsupported file type. Please upload a PNG, JPEG, or WebP image.");
      return;
    }

    if (file.size > maxFileSize) {
      resetPreviewState();
      setError("File is too large. Please upload an image smaller than 10 MB.");
      return;
    }

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }

    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }

    const nextOriginalUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setOriginalUrl(nextOriginalUrl);
    setProcessedUrl("");
    setError("");
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

  function processBackgroundRemoval(activeTolerance = tolerance) {
    if (!selectedFile || !originalUrl) {
      setError("Please upload an image before removing the background.");
      return;
    }

    setError("");
    setIsProcessing(true);

    const image = new window.Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        setError("This browser could not process the image. Please try again.");
        setIsProcessing(false);
        return;
      }

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      const baseColor = getAverageColorFromEdges(imageData);
      const threshold = (activeTolerance / 100) * 220;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const distance = Math.sqrt(
          (red - baseColor.r) ** 2 +
            (green - baseColor.g) ** 2 +
            (blue - baseColor.b) ** 2,
        );

        if (distance <= threshold) {
          data[i + 3] = 0;
        }
      }

      context.putImageData(imageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Background removal failed. Please try another image.");
            setIsProcessing(false);
            return;
          }

          if (processedUrl) {
            URL.revokeObjectURL(processedUrl);
          }

          setProcessedUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        },
        "image/png",
        1,
      );
    };

    image.onerror = () => {
      setError("Could not read this image. Please try a different file.");
      setIsProcessing(false);
    };

    image.src = originalUrl;
  }

  function handleToleranceChange(event: ChangeEvent<HTMLInputElement>) {
    const nextTolerance = clamp(Number(event.target.value), 0, 100);
    setTolerance(nextTolerance);

    if (selectedFile && originalUrl) {
      processBackgroundRemoval(nextTolerance);
    }
  }

  function handleDownload() {
    if (!processedUrl) {
      return;
    }

    const baseName = selectedFile?.name.replace(/\.[^/.]+$/, "") || "background-removed";
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `${baseName}-bg-removed.png`;
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
          Upload a product or portrait photo
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Drag and drop an image here or click to browse. Works best with a clear,
          solid background.
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
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-slate-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Selected File
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {selectedFile.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (originalUrl) {
                  URL.revokeObjectURL(originalUrl);
                }

                if (processedUrl) {
                  URL.revokeObjectURL(processedUrl);
                }

                setOriginalUrl("");
                setProcessedUrl("");
                setSelectedFile(null);
                setError("");
              }}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white"
            >
              Remove File
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-[var(--foreground)]">
              <label htmlFor="bg-tolerance">Background tolerance</label>
              <span>{tolerance}%</span>
            </div>
            <input
              id="bg-tolerance"
              type="range"
              min={0}
              max={100}
              value={tolerance}
              onChange={handleToleranceChange}
              className="h-2 w-full cursor-pointer accent-[var(--primary)]"
            />
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
            onClick={() => processBackgroundRemoval()}
            disabled={isProcessing}
            className="rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Removing background..." : "Remove Background"}
          </button>

          {processedUrl && (
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
            >
              Download PNG
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
                src={originalUrl}
                alt="Original uploaded preview"
                className="max-h-80 w-full rounded-lg object-contain"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Background Removed
            </p>
            <div className="mt-4 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_center,_#f8fafc_0%,_#e2e8f0_36%,_#cbd5e1_100%)] p-3">
              {processedUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={processedUrl}
                  alt="Background-removed preview"
                  className="max-h-80 w-full rounded-lg object-contain"
                />
              ) : (
                <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-[var(--muted)]">
                  {isProcessing ? "Processing image..." : "Your background-removed result will appear here."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
