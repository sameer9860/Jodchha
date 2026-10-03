import type { Category } from "@/lib/types";

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({
  categories,
}: CategoryGridProps) {
  return (
    <section id="categories" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
          Explore
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
          Popular Categories
        </h2>

        <p className="mt-2 text-[var(--muted)]">
          Browse useful websites by category.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="group rounded-xl border border-[var(--border)] bg-[var(--white)] p-5 text-left transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden="true">
              {category.icon || "🔗"}
            </span>

            <h3 className="mt-4 font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              {category.name}
            </h3>

            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {category.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}