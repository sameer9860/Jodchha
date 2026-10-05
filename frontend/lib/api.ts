import type { Category, Website } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

  export function getWebsiteRedirectUrl(slug: string): string {
  return `${API_URL}/go/${encodeURIComponent(slug)}/`;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories/`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function getFeaturedWebsites(): Promise<Website[]> {
  const response = await fetch(`${API_URL}/websites/?featured=true`);

  if (!response.ok) {
    throw new Error("Failed to fetch featured websites");
  }

  return response.json();
}

export async function getSearchResults(
  query: string,
): Promise<Website[]> {
  const response = await fetch(
    `${API_URL}/websites/?search=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to search websites");
  }

  return response.json();
}

export async function getCategoryWebsites(
  category: string,
): Promise<Website[]> {
  const response = await fetch(
    `${API_URL}/websites/?category=${encodeURIComponent(category)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category websites");
  }

  return response.json();
}