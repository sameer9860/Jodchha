import type {
  AdminCategory,
  AdminClick,
  AdminShortLink,
  AdminWebsite,
  AnalyticsDashboard,
  AuthTokens,
  Category,
  Website,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jodchha.com.np";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchJson<T>(url: string, fallbackMessage: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new ApiError(fallbackMessage, 503);
  }

  if (!response.ok) {
    throw new ApiError(fallbackMessage, response.status);
  }

  return response.json();
}

export function getWebsiteRedirectUrl(slug: string): string {
  return `${API_URL}/go/${encodeURIComponent(slug)}/`;
}

export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(
    `${API_URL}/categories/`,
    "Failed to fetch categories",
  );
}

export async function getFeaturedWebsites(): Promise<Website[]> {
  return fetchJson<Website[]>(
    `${API_URL}/websites/?featured=true`,
    "Failed to fetch featured websites",
  );
}

export async function getSearchResults(query: string): Promise<Website[]> {
  return fetchJson<Website[]>(
    `${API_URL}/websites/?search=${encodeURIComponent(query)}`,
    "Failed to search websites",
  );
}

export async function getCategoryWebsites(
  category: string,
): Promise<Website[]> {
  return fetchJson<Website[]>(
    `${API_URL}/websites/?category=${encodeURIComponent(category)}`,
    "Failed to fetch category websites",
  );
}

export type ShortLink = {
  id: number;
  code: string;
  destination_url: string;
  click_count: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
};

export async function createShortLink(
  destinationUrl: string,
): Promise<ShortLink> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/shortlinks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination_url: destinationUrl,
      }),
    });
  } catch {
    throw new ApiError("Failed to create short link", 503);
  }

  if (!response.ok) {
    throw new ApiError("Failed to create short link", response.status);
  }

  return response.json();
}

export function getShortLinkUrl(code: string): string {
  const path = `/s/${encodeURIComponent(code)}`;

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }

  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}

async function readErrorDetail(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as Record<string, unknown>;

    if (typeof payload.detail === "string") {
      return payload.detail;
    }

    if (Array.isArray(payload.detail)) {
      return payload.detail.join(" ");
    }

    if (Array.isArray(payload.non_field_errors)) {
      return payload.non_field_errors.join(" ");
    }

    const fieldErrors = Object.entries(payload)
      .filter(([key]) => key !== "detail" && key !== "non_field_errors")
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((item) => `${key}: ${String(item)}`);
        }
        if (typeof value === "string") {
          return [`${key}: ${value}`];
        }
        return [];
      });

    if (fieldErrors.length > 0) {
      return fieldErrors.join(" ");
    }

    if (payload.detail && typeof payload.detail === "object") {
      return Object.values(payload.detail as Record<string, string[]>)
        .flat()
        .join(" ");
    }
  } catch {
    // Ignore JSON parse failures and use the fallback message.
  }

  return fallback;
}

function clearAdminSession() {
  sessionStorage.removeItem("jodchha_access_token");
  sessionStorage.removeItem("jodchha_refresh_token");
  sessionStorage.removeItem("jodchha_admin_username");
}

async function throwIfNotOk(response: Response, fallback: string) {
  if (response.ok) {
    return;
  }

  if (response.status === 401) {
    clearAdminSession();
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (response.status === 403) {
    throw new ApiError(
      "Admin access required. Sign in with a staff account.",
      403,
    );
  }

  const detail = await readErrorDetail(response, fallback);
  throw new ApiError(detail, response.status);
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/auth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const detail = await readErrorDetail(
      response,
      "Invalid username or password",
    );
    throw new ApiError(detail, response.status);
  }

  return response.json();
}

export async function refreshAccessToken(
  refresh: string,
): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh,
    }),
  });

  if (!response.ok) {
    throw new ApiError("Unable to refresh access token", response.status);
  }

  return response.json();
}

async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = sessionStorage.getItem("jodchha_access_token");
  const refreshToken = sessionStorage.getItem("jodchha_refresh_token");

  if (!accessToken) {
    throw new ApiError("Authentication required", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const request = (token: string) => {
    const nextHeaders = new Headers(headers);
    nextHeaders.set("Authorization", `Bearer ${token}`);

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: nextHeaders,
      cache: "no-store",
    });
  };

  let response = await request(accessToken);

  if (response.status !== 401 || !refreshToken) {
    return response;
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);

    sessionStorage.setItem("jodchha_access_token", tokens.access);

    if (tokens.refresh) {
      sessionStorage.setItem("jodchha_refresh_token", tokens.refresh);
    }

    response = await request(tokens.access);
    return response;
  } catch {
    clearAdminSession();
    throw new ApiError("Session expired. Please sign in again.", 401);
  }
}

export async function getAnalyticsDashboard(
  startDate?: string,
  endDate?: string,
): Promise<AnalyticsDashboard> {
  const params = new URLSearchParams();

  if (startDate) {
    params.set("start_date", startDate);
  }

  if (endDate) {
    params.set("end_date", endDate);
  }

  const queryString = params.toString();
  const endpoint = queryString
    ? `/analytics/?${queryString}`
    : "/analytics/";

  const response = await authenticatedFetch(endpoint);
  await throwIfNotOk(response, "Failed to fetch analytics");
  return response.json();
}

export type AdminCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
};

export type AdminWebsiteInput = {
  category: number;
  name: string;
  slug?: string;
  description: string;
  url: string;
  logo?: string;
  is_featured?: boolean;
  is_active?: boolean;
};

export type AdminShortLinkInput = {
  code?: string;
  destination_url: string;
  is_active?: boolean;
  expires_at?: string | null;
};

export async function adminListCategories(params?: {
  search?: string;
  is_active?: string;
}): Promise<AdminCategory[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.is_active) query.set("is_active", params.is_active);
  const suffix = query.toString() ? `?${query}` : "";
  const response = await authenticatedFetch(`/admin/categories/${suffix}`);
  await throwIfNotOk(response, "Failed to load categories");
  return response.json();
}

export async function adminCreateCategory(
  data: AdminCategoryInput,
): Promise<AdminCategory> {
  const response = await authenticatedFetch("/admin/categories/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to create category");
  return response.json();
}

export async function adminUpdateCategory(
  id: number,
  data: Partial<AdminCategoryInput>,
): Promise<AdminCategory> {
  const response = await authenticatedFetch(`/admin/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to update category");
  return response.json();
}

export async function adminDeleteCategory(id: number): Promise<void> {
  const response = await authenticatedFetch(`/admin/categories/${id}/`, {
    method: "DELETE",
  });
  await throwIfNotOk(response, "Failed to delete category");
}

export async function adminListWebsites(params?: {
  search?: string;
  category?: string;
  is_active?: string;
  is_featured?: string;
}): Promise<AdminWebsite[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);
  if (params?.is_active) query.set("is_active", params.is_active);
  if (params?.is_featured) query.set("is_featured", params.is_featured);
  const suffix = query.toString() ? `?${query}` : "";
  const response = await authenticatedFetch(`/admin/websites/${suffix}`);
  await throwIfNotOk(response, "Failed to load websites");
  return response.json();
}

export async function adminCreateWebsite(
  data: AdminWebsiteInput,
): Promise<AdminWebsite> {
  const response = await authenticatedFetch("/admin/websites/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to create website");
  return response.json();
}

export async function adminUpdateWebsite(
  id: number,
  data: Partial<AdminWebsiteInput>,
): Promise<AdminWebsite> {
  const response = await authenticatedFetch(`/admin/websites/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to update website");
  return response.json();
}

export async function adminDeleteWebsite(id: number): Promise<void> {
  const response = await authenticatedFetch(`/admin/websites/${id}/`, {
    method: "DELETE",
  });
  await throwIfNotOk(response, "Failed to delete website");
}

export async function adminListShortLinks(params?: {
  search?: string;
  is_active?: string;
}): Promise<AdminShortLink[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.is_active) query.set("is_active", params.is_active);
  const suffix = query.toString() ? `?${query}` : "";
  const response = await authenticatedFetch(`/admin/shortlinks/${suffix}`);
  await throwIfNotOk(response, "Failed to load short links");
  return response.json();
}

export async function adminCreateShortLink(
  data: AdminShortLinkInput,
): Promise<AdminShortLink> {
  const response = await authenticatedFetch("/admin/shortlinks/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to create short link");
  return response.json();
}

export async function adminUpdateShortLink(
  id: number,
  data: Partial<AdminShortLinkInput>,
): Promise<AdminShortLink> {
  const response = await authenticatedFetch(`/admin/shortlinks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await throwIfNotOk(response, "Failed to update short link");
  return response.json();
}

export async function adminDeleteShortLink(id: number): Promise<void> {
  const response = await authenticatedFetch(`/admin/shortlinks/${id}/`, {
    method: "DELETE",
  });
  await throwIfNotOk(response, "Failed to delete short link");
}

export async function adminListClicks(params?: {
  search?: string;
}): Promise<AdminClick[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query}` : "";
  const response = await authenticatedFetch(`/admin/clicks/${suffix}`);
  await throwIfNotOk(response, "Failed to load clicks");
  return response.json();
}

export async function adminDeleteClick(id: number): Promise<void> {
  const response = await authenticatedFetch(`/admin/clicks/${id}/`, {
    method: "DELETE",
  });
  await throwIfNotOk(response, "Failed to delete click");
}
