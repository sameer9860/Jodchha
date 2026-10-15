"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError, getAnalyticsDashboard } from "@/lib/api";
import type { AnalyticsDashboard } from "@/lib/types";

import DailyClicksChart from "@/components/admin/DailyClicksChart";
import CategoryClicksChart from "@/components/admin/CategoryClicksChart";
import { AdminDashboardSkeleton } from "@/components/ui/Skeleton";

const summaryCards = [
  { key: "total_clicks", label: "Clicks in Range" },
  { key: "clicks_today", label: "Today" },
  { key: "clicks_week", label: "Last 7 Days" },
  { key: "clicks_month", label: "Last 30 Days" },
] as const;

const sidebarItems = [
  { id: "overview", label: "Overview" },
  { id: "date-filters", label: "Date Filters" },
  { id: "top-websites", label: "Top Websites" },
  { id: "recent-clicks", label: "Recent Clicks" },
] as const;

function formatLocalDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDefaultRange(days: 7 | 30) {
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));

  return {
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(end),
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState<7 | 30 | "custom">(30);
  const [refreshing, setRefreshing] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [activeSection, setActiveSection] =
    useState<(typeof sidebarItems)[number]["id"]>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("Admin");

  async function loadDashboard(options?: {
    startDate?: string;
    endDate?: string;
    showLoading?: boolean;
  }) {
    const accessToken = sessionStorage.getItem("jodchha_access_token");

    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    const startDate = options?.startDate ?? appliedStartDate;
    const endDate = options?.endDate ?? appliedEndDate;
    const showLoading = options?.showLoading ?? true;

    if (startDate && endDate && startDate > endDate) {
      setError("Start date must be before or equal to the end date.");
      return;
    }

    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const result = await getAnalyticsDashboard(
        startDate || undefined,
        endDate || undefined,
      );
      setData(result);
      setAppliedStartDate(result.start_date);
      setAppliedEndDate(result.end_date);
      setDraftStartDate(result.start_date);
      setDraftEndDate(result.end_date);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to load analytics. Please try again or sign in again.";

      setError(message);

      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        sessionStorage.removeItem("jodchha_access_token");
        sessionStorage.removeItem("jodchha_refresh_token");
        sessionStorage.removeItem("jodchha_admin_username");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("jodchha_admin_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    void loadDashboard({ showLoading: true });
    // Initial load only — subsequent loads are triggered by user actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function scrollToSection(id: (typeof sidebarItems)[number]["id"]) {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function applyDateFilters() {
    if (draftStartDate && draftEndDate && draftStartDate > draftEndDate) {
      setError("Start date must be before or equal to the end date.");
      return;
    }

    const defaults = getDefaultRange(30);
    const matchesSeven =
      draftStartDate === getDefaultRange(7).startDate &&
      draftEndDate === getDefaultRange(7).endDate;
    const matchesThirty =
      draftStartDate === defaults.startDate &&
      draftEndDate === defaults.endDate;

    setRange(matchesSeven ? 7 : matchesThirty ? 30 : "custom");
    void loadDashboard({
      startDate: draftStartDate,
      endDate: draftEndDate,
      showLoading: true,
    });
  }

  function clearDateFilters() {
    const defaults = getDefaultRange(30);
    setRange(30);
    setDraftStartDate(defaults.startDate);
    setDraftEndDate(defaults.endDate);
    void loadDashboard({
      startDate: defaults.startDate,
      endDate: defaults.endDate,
      showLoading: true,
    });
  }

  function handlePresetRange(days: 7 | 30) {
    const next = getDefaultRange(days);
    setRange(days);
    setDraftStartDate(next.startDate);
    setDraftEndDate(next.endDate);
    void loadDashboard({
      startDate: next.startDate,
      endDate: next.endDate,
      showLoading: false,
    });
  }

  function exportAnalyticsCsv() {
    if (!data) return;

    const rows: string[][] = [
      ["Jodchha Analytics Report"],
      ["Exported At", new Date().toISOString()],
      ["Start Date", data.start_date],
      ["End Date", data.end_date],
      [],
      ["Daily Clicks"],
      ["Date", "Clicks"],
      ...data.daily_clicks.map((item) => [
        String(item.date),
        String(item.clicks),
      ]),
      [],
      ["Top Websites"],
      ["Website", "Clicks"],
      ...data.top_websites.map((item) => [
        item.name,
        String(item.click_count),
      ]),
      [],
      ["Top Categories"],
      ["Category", "Clicks"],
      ...data.top_categories.map((item) => [
        item.website__category__name,
        String(item.clicks),
      ]),
      [],
      ["Recent Clicks"],
      ["Type", "Destination", "Referrer", "Time"],
      ...data.recent_clicks.map((item) => [
        item.type,
        item.destination,
        item.referrer,
        item.created_at,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `jodchha-analytics-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function handleLogout() {
    sessionStorage.removeItem("jodchha_access_token");
    sessionStorage.removeItem("jodchha_refresh_token");
    sessionStorage.removeItem("jodchha_admin_username");
    router.replace("/admin/login");
  }

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Unable to load dashboard
          </h1>
          <p className="mt-3 text-sm text-red-600">
            {error || "No analytics data was returned."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => void loadDashboard({ showLoading: true })}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => router.replace("/admin/login")}
              className="rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </main>
    );
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
            {sidebarItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === item.id
                    ? "bg-slate-800 text-white shadow-inner shadow-slate-700/50"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                  {index + 1}
                </span>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Status
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-300">
                Analytics connected
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {data.start_date} → {data.end_date}
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  Dashboard
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Analytics Dashboard
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    void loadDashboard({
                      startDate: appliedStartDate,
                      endDate: appliedEndDate,
                      showLoading: false,
                    })
                  }
                  disabled={refreshing}
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={exportAnalyticsCsv}
                  disabled={!data || refreshing}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Export CSV
                </button>

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
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          scrollToSection("overview");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Dashboard
                      </button>
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
          </header>

          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
            <section
              id="date-filters"
              className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                Filter Analytics by Date
              </h2>

              <form
                className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
                onSubmit={(event) => {
                  event.preventDefault();
                  applyDateFilters();
                }}
              >
                <div className="flex-1">
                  <label
                    htmlFor="start-date"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={draftStartDate}
                    max={draftEndDate || undefined}
                    onChange={(event) => setDraftStartDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="end-date"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={draftEndDate}
                    min={draftStartDate || undefined}
                    onChange={(event) => setDraftEndDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || refreshing}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Apply Filters
                </button>

                <button
                  type="button"
                  disabled={loading || refreshing}
                  onClick={clearDateFilters}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear
                </button>
              </form>
            </section>

            <section id="overview" className="scroll-mt-8">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Overview
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <article
                    key={card.key}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tabular-nums text-slate-900">
                      {data.summary[card.key].toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <DailyClicksChart
              dailyClicks={data.daily_clicks}
              startDate={data.start_date}
              endDate={data.end_date}
              range={range}
              onRangeChange={handlePresetRange}
            />
            <CategoryClicksChart categories={data.top_categories} />

            <section
              id="top-websites"
              className="scroll-mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Top Websites
                </h2>
                {data.top_websites.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No website clicks recorded yet.
                  </p>
                ) : (
                  <div className="mt-4 divide-y divide-slate-200">
                    {data.top_websites.map((website, index) => (
                      <div
                        key={website.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="text-sm text-slate-400">
                            {index + 1}.
                          </span>
                          <span className="truncate text-sm font-medium text-slate-800">
                            {website.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-slate-900">
                          {website.click_count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Top Categories
                </h2>
                {data.top_categories.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No category clicks recorded yet.
                  </p>
                ) : (
                  <div className="mt-4 divide-y divide-slate-200">
                    {data.top_categories.map((category) => (
                      <div
                        key={category.website__category__name}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {category.website__category__name}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-slate-900">
                          {category.clicks.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>

            <section
              id="recent-clicks"
              className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Clicks
              </h2>
              {data.recent_clicks.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No recent clicks recorded.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="px-3 py-3 font-medium">Type</th>
                        <th className="px-3 py-3 font-medium">Destination</th>
                        <th className="px-3 py-3 font-medium">Referrer</th>
                        <th className="px-3 py-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_clicks.map((click) => (
                        <tr
                          key={click.id}
                          className="border-b border-slate-200 last:border-0"
                        >
                          <td className="px-3 py-4 text-slate-500">
                            {click.type === "website"
                              ? "Website"
                              : "Short Link"}
                          </td>
                          <td className="px-3 py-4 font-medium text-slate-800">
                            {click.destination || "Unknown"}
                          </td>
                          <td className="px-3 py-4 text-slate-500">
                            {click.referrer || "Direct"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                            {new Date(click.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
