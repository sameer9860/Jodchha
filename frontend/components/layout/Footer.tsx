export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--white)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--foreground)]">Jodchha</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Connect. Discover. Go.
          </p>
        </div>

        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Jodchha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

