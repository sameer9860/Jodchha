import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--white)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--foreground)]">Jodchha</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Connect. Discover. Go.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm font-medium text-[var(--muted)]">
          <Link href="/#discover" className="hover:text-[var(--primary)]">
            Discover
          </Link>
          <Link href="/#categories" className="hover:text-[var(--primary)]">
            Categories
          </Link>
          <Link href="/tools" className="hover:text-[var(--primary)]">
            Tools
          </Link>
          <Link href="/tools/shortener" className="hover:text-[var(--primary)]">
            Shortener
          </Link>
        </nav>

        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Jodchha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
