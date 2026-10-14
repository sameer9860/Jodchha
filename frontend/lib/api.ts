import type {
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
    const payload = (await response.json()) as {
      detail?: string | string[] | Record<string, string[]>;
      non_field_errors?: string[];
    };

    if (typeof payload.detail === "string") {
      return payload.detail;
    }

    if (Array.isArray(payload.detail)) {
      return payload.detail.join(" ");
    }

    if (Array.isArray(payload.non_field_errors)) {
      return payload.non_field_errors.join(" ");
    }

    if (payload.detail && typeof payload.detail === "object") {
      return Object.values(payload.detail).flat().join(" ");
    }
  } catch {
    // Ignore JSON parse failures and use the fallback message.
  }

  return fallback;
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

async function authenticatedFetch(endpoint: string): Promise<Response> {
  const accessToken = sessionStorage.getItem("jodchha_access_token");
  const refreshToken = sessionStorage.getItem("jodchha_refresh_token");

  if (!accessToken) {
    throw new ApiError("Authentication required", 401);
  }

  const request = (token: string) =>
    fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

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
    sessionStorage.removeItem("jodchha_access_token");
    sessionStorage.removeItem("jodchha_refresh_token");
    sessionStorage.removeItem("jodchha_admin_username");
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

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem("jodchha_access_token");
      sessionStorage.removeItem("jodchha_refresh_token");
      sessionStorage.removeItem("jodchha_admin_username");
      throw new ApiError("Session expired. Please sign in again.", 401);
    }

    if (response.status === 403) {
      throw new ApiError(
        "Admin access required. Sign in with a staff account.",
        403,
      );
    }

    const detail = await readErrorDetail(
      response,
      "Failed to fetch analytics",
    );
    throw new ApiError(detail, response.status);
  }

  return response.json();
}
