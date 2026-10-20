"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import {
  ApiError,
  adminCreateShortLink,
  adminDeleteShortLink,
  adminListShortLinks,
  adminUpdateShortLink,
  getShortLinkUrl,
} from "@/lib/api";
import type { AdminShortLink } from "@/lib/types";

const emptyForm = {
  code: "",
  destination_url: "",
  expires_at: "",
  is_active: true,
};

export default function AdminShortLinksPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminShortLink | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadItems(nextSearch = search) {
    const accessToken = sessionStorage.getItem("jodchha_access_token");
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await adminListShortLinks({
        search: nextSearch || undefined,
      });
      setItems(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to load short links.",
      );
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.replace("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(item: AdminShortLink) {
    setEditing(item);
    setForm({
      code: item.code,
      destination_url: item.destination_url,
      expires_at: item.expires_at
        ? item.expires_at.slice(0, 16)
        : "",
      is_active: item.is_active,
    });
    setFormOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        code: form.code.trim(),
        destination_url: form.destination_url.trim(),
        expires_at: form.expires_at
          ? new Date(form.expires_at).toISOString()
          : null,
        is_active: form.is_active,
      };

      if (editing) {
        await adminUpdateShortLink(editing.id, payload);
      } else {
        await adminCreateShortLink(payload);
      }

      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to save short link.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: AdminShortLink) {
    if (!window.confirm(`Delete short link "${item.code}"?`)) {
      return;
    }

    try {
      await adminDeleteShortLink(item.id);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to delete short link.",
      );
    }
  }

  async function toggleActive(item: AdminShortLink) {
    try {
      await adminUpdateShortLink(item.id, { is_active: !item.is_active });
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to update short link.",
      );
    }
  }

  return (
    <AdminShell
      title="Short Links"
      subtitle="Content"
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
        >
          Add Short Link
        </button>
      }
    >
      <div className="space-y-6">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void loadItems(search);
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by code or destination..."
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
            <p className="p-8 text-sm text-slate-500">Loading short links...</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-sm text-slate-500">No short links found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">S.N</th>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Destination</th>
                    <th className="px-4 py-3 font-medium">Clicks</th>
                    <th className="px-4 py-3 font-medium">Expires</th>
                    <th className="px-4 py-3 font-medium">Active</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-4 tabular-nums text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={getShortLinkUrl(item.code)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-cyan-700 hover:underline"
                        >
                          {item.code}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-sm truncate text-slate-700">
                          {item.destination_url}
                        </div>
                      </td>
                      <td className="px-4 py-4 tabular-nums text-slate-700">
                        {item.click_count.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {item.expires_at
                          ? new Date(item.expires_at).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void toggleActive(item)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(item)}
                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Short Link" : "Add Short Link"}
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Destination URL
                </label>
                <input
                  required
                  type="url"
                  value={form.destination_url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      destination_url: event.target.value,
                    }))
                  }
                  placeholder="https://example.com/long-url"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Custom code (optional)
                </label>
                <input
                  value={form.code}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, code: event.target.value }))
                  }
                  placeholder="auto-generated if empty"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Expires at (optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      expires_at: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      is_active: event.target.checked,
                    }))
                  }
                />
                Active
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
