"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import {
  ApiError,
  adminCreateWebsite,
  adminDeleteWebsite,
  adminListCategories,
  adminListWebsites,
  adminUpdateWebsite,
} from "@/lib/api";
import type { AdminCategory, AdminWebsite } from "@/lib/types";

const emptyForm = {
  category: "",
  name: "",
  slug: "",
  description: "",
  url: "",
  logo: "",
  is_featured: false,
  is_active: true,
};

export default function AdminWebsitesPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminWebsite[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminWebsite | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadItems(nextSearch = search, nextCategory = categoryFilter) {
    const accessToken = sessionStorage.getItem("jodchha_access_token");
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [websites, cats] = await Promise.all([
        adminListWebsites({
          search: nextSearch || undefined,
          category: nextCategory || undefined,
        }),
        adminListCategories(),
      ]);
      setItems(websites);
      setCategories(cats);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to load websites.",
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
    setForm({
      ...emptyForm,
      category: categories[0] ? String(categories[0].id) : "",
    });
    setFormOpen(true);
  }

  function openEdit(item: AdminWebsite) {
    setEditing(item);
    setForm({
      category: String(item.category),
      name: item.name,
      slug: item.slug,
      description: item.description,
      url: item.url,
      logo: item.logo,
      is_featured: item.is_featured,
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
        category: Number(form.category),
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
        logo: form.logo.trim(),
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      if (editing) {
        await adminUpdateWebsite(editing.id, payload);
      } else {
        await adminCreateWebsite(payload);
      }

      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to save website.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: AdminWebsite) {
    if (!window.confirm(`Delete website "${item.name}"?`)) {
      return;
    }

    try {
      await adminDeleteWebsite(item.id);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to delete website.",
      );
    }
  }

  async function toggleField(
    item: AdminWebsite,
    field: "is_active" | "is_featured",
  ) {
    try {
      await adminUpdateWebsite(item.id, { [field]: !item[field] });
      await loadItems();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to update website.",
      );
    }
  }

  return (
    <AdminShell
      title="Websites"
      subtitle="Content"
      actions={
        <button
          type="button"
          onClick={openCreate}
          disabled={categories.length === 0}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Website
        </button>
      }
    >
      <div className="space-y-6">
        {categories.length === 0 && !loading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Create at least one category before adding websites.
          </div>
        )}

        <form
          className="flex flex-col gap-3 lg:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void loadItems(search, categoryFilter);
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search websites..."
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-400"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Filter
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
            <p className="p-8 text-sm text-slate-500">Loading websites...</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-sm text-slate-500">No websites found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Website</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Clicks</th>
                    <th className="px-4 py-3 font-medium">Featured</th>
                    <th className="px-4 py-3 font-medium">Active</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="mt-1 max-w-sm truncate text-xs text-slate-500">
                          {item.url}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {item.category_detail.name}
                      </td>
                      <td className="px-4 py-4 tabular-nums text-slate-700">
                        {item.click_count.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void toggleField(item, "is_featured")}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.is_featured
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.is_featured ? "Featured" : "Normal"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void toggleField(item, "is_active")}
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
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Website" : "Add Website"}
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Slug (optional)
                </label>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, slug: event.target.value }))
                  }
                  placeholder="auto-generated from name"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  URL
                </label>
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, url: event.target.value }))
                  }
                  placeholder="https://example.com"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Logo URL (optional)
                </label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, logo: event.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      is_featured: event.target.checked,
                    }))
                  }
                />
                Featured
              </label>

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
