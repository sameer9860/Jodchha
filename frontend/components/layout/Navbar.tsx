import Link from "next/dist/client/link";

export default function Navbar() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--white)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[var(--foreground)]"
        >
          Jodchha
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--foreground)] transition hover:text-[var(--primary)]"
          >
            Home
          </Link>

          <Link
            href="#discover"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
          >
            Discover
          </Link>

          <Link
            href="#tools"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
          >
            Tools
          </Link>

          <Link
            href="#categories"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
          >
            Categories
          </Link>
        </nav>

        <Link
          href="#discover"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Explore
        </Link>
      </div>
    </header>
  );
}
