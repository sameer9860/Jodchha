"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { ApiError, loginAdmin } from "@/lib/api";



export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState("/admin");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const tokens = await loginAdmin(username, password);

      sessionStorage.setItem("jodchha_access_token", tokens.access);
      sessionStorage.setItem("jodchha_refresh_token", tokens.refresh);
      sessionStorage.setItem(
        "jodchha_admin_username",
        tokens.username ?? username,
      );

      router.push(nextPath);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--white)] p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Jodchha
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to add categories and websites, or open analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              id="username"
              type="text"
              placeholder=" "
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
              className="peer h-12 w-full rounded-lg border border-[var(--border)] bg-transparent px-4 text-[var(--foreground)] outline-none transition placeholder:text-transparent focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
            />
            <label
              htmlFor="username"
              className="pointer-events-none absolute left-4 top-0 -translate-y-1/2 bg-[var(--white)] px-1 text-xs font-medium text-[var(--primary)] transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[var(--muted)] peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--primary)]"
            >
              Username
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="peer h-12 w-full rounded-lg border border-[var(--border)] bg-transparent py-2 pl-4 pr-12 text-[var(--foreground)] outline-none transition placeholder:text-transparent focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-4 top-0 -translate-y-1/2 bg-[var(--white)] px-1 text-xs font-medium text-[var(--primary)] transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[var(--muted)] peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--primary)]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              {showPassword ? (
                <Eye aria-hidden="true" size={18} />
              ) : (
                <EyeOff aria-hidden="true" size={18} />
              )}
            </button>
          </div>

        
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-[var(--primary)] font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
