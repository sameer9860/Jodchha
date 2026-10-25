import Link from "next/link";

import WebsiteLogo from "@/components/directory/WebsiteLogo";
import { getWebsitePageUrl } from "@/lib/api";
import type { Website } from "@/lib/types";

type WebsiteCardProps = {
  website: Website;
  badge?: string;
};

export default function WebsiteCard({ website, badge }: WebsiteCardProps) {
  const label = badge ?? website.category.name;

  return (
    <Link
      href={getWebsitePageUrl(website.slug)}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <WebsiteLogo
          name={website.name}
          logo={website.logo}
          fallback={website.category.icon || "🔗"}
        />

        {label && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            {label}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
        {website.name}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">
        {website.description}
      </p>

      <span className="mt-6 inline-flex items-center font-semibold text-[var(--primary)] transition hover:text-[var(--primary-dark)]">
        View details
        <span className="ml-2 transition group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
