"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "24px",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "28rem",
            border: "1px solid #e2e8f0",
            borderRadius: "1rem",
            background: "#ffffff",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 1px 2px rgb(15 23 42 / 0.04)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#dc2626",
            }}
          >
            500
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Internal Server Error
          </h1>
          <p
            style={{
              margin: "0.75rem 0 0",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#64748b",
            }}
          >
            Something went wrong on our side. Please try again in a moment.
          </p>
          {error.digest ? (
            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.75rem",
                color: "#94a3b8",
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: "0.5rem",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.875rem",
                padding: "0.75rem 1.25rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                color: "#0f172a",
                fontWeight: 600,
                fontSize: "0.875rem",
                padding: "0.75rem 1.25rem",
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
