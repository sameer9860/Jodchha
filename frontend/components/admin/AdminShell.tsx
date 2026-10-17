"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin", label: "Analytics", exact: true },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/websites", label: "Websites" },
  { href: "/admin/short-links", label: "Short Links" },
  { href: "/admin/clicks", label: "Clicks" },
] as const;

type AdminShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminShell({
  title,
  subtitle = "Admin",
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("jodchha_access_token");
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    const storedUsername = sessionStorage.getItem("jodchha_admin_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [router]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-admin-menu]")) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("jodchha_access_token");
    sessionStorage.removeItem("jodchha_refresh_token");
    sessionStorage.removeItem("jodchha_admin_username");
    router.replace("/admin/login");
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const initials = username.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex">
          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-white shadow-lg shadow-cyan-500/25">
              J
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Admin
              </p>
              <h1 className="text-lg font-bold text-white">Jodchha</h1>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive(item.href, "exact" in item ? item.exact : false)
                    ? "bg-slate-800 text-white shadow-inner shadow-slate-700/50"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Signed in
              </p>
              <p className="mt-2 truncate text-sm font-medium text-emerald-300">
                {username}
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
                    onClick={() => setMobileNavOpen((value) => !value)}
                  >
                    Menu
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                      {subtitle}
                    </p>
                    <h2 className="mt-1 truncate text-2xl font-bold text-slate-900">
                      {title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {actions}

                <div className="relative" data-admin-menu>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-2 text-left shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-slate-900">
                        {username}
                      </p>
                      <p className="text-xs text-slate-500">Staff admin</p>
                    </div>
                    <span className="text-lg text-slate-500">▾</span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200">
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Dashboard
                      </Link>
                      <div className="rounded-xl px-3 py-2 text-left text-sm text-slate-500">
                        Signed in as{" "}
                        <span className="font-medium text-slate-800">
                          {username}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {mobileNavOpen && (
              <div className="border-t border-slate-200 px-4 py-3 lg:hidden">
                <nav className="flex flex-wrap gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive(item.href, "exact" in item ? item.exact : false)
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </header>

          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
