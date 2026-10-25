"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import {
  ApiError,
  adminDeleteClick,
  adminListClicks,
} from "@/lib/api";
import type { AdminClick } from "@/lib/types";

const PAGE_SIZE = 20;

export default function AdminClicksPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminClick[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadItems(nextSearch = search, nextPage = page) {
    const accessToken = sessionStorage.getItem("jodchha_access_token");
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await adminListClicks({
        search: nextSearch || undefined,
        page: nextPage,
      });
      setItems(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to load clicks.",
      );
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.replace("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, page]);

  async function handleDelete(item: AdminClick) {
    if (!window.confirm(`Delete click #${item.id}?`)) {
      return;
    }

    try {
      await adminDeleteClick(item.id);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to delete click.",
      );
    }
  }

  return (
    <AdminShell
      title="Clicks"
      subtitle="Content"
      actions={
        <button
          type="button"
          onClick={() => void loadItems()}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            void loadItems(search, 1);
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by website, short code, or referrer..."
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Search
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-sm text-slate-500">Loading clicks...</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-sm text-slate-500">No clicks found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">S.N</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Destination</th>
                    <th className="px-4 py-3 font-medium">Referrer</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-4 tabular-nums text-slate-500">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {item.website ? "Website" : "Short Link"}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {item.website_name ||
                          item.short_link_code ||
                          "Unknown"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-xs truncate text-slate-500">
                          {item.referrer || "Direct"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AdminPagination
                page={page}
                count={count}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Clicks are listed newest first. Delete a record only if it was created
          in error.
        </p>
      </div>
    </AdminShell>
  );
}
