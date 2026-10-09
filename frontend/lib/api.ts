import type {
  AnalyticsDashboard,
  AuthTokens,
  Category,
  Website,
} from "./types";

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
  const response = await fetch(`${API_URL}/shortlinks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination_url: destinationUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create short link");
  }

  return response.json();
}

export function getShortLinkUrl(code: string): string {
  return `${API_URL}/s/${encodeURIComponent(code)}/`;
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
    throw new Error("Invalid username or password");
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
    throw new Error("Unable to refresh access token");
  }

  return response.json();
}

async function authenticatedFetch(endpoint: string): Promise<Response> {
  const accessToken = sessionStorage.getItem("jodchha_access_token");
  const refreshToken = sessionStorage.getItem("jodchha_refresh_token");

  if (!accessToken) {
    throw new Error("Authentication required");
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
    throw new Error("Session expired. Please sign in again.");
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
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}