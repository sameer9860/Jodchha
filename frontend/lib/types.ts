export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type AdminCategory = Category & {
  is_active: boolean;
  created_at: string;
};

export type DailyClick = {
  date: string;
  clicks: number;
};

export type Website = {
  id: number;
  name: string;
  slug: string;
  description: string;
  url: string;
  logo: string;
  category: Category;
  is_featured: boolean;
};

export type AdminWebsite = {
  id: number;
  category: number;
  category_detail: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
  name: string;
  slug: string;
  description: string;
  url: string;
  logo: string;
  is_featured: boolean;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminShortLink = {
  id: number;
  code: string;
  destination_url: string;
  click_count: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
};

export type AdminClick = {
  id: number;
  website: number | null;
  website_name: string | null;
  short_link: number | null;
  short_link_code: string | null;
  referrer: string;
  user_agent: string;
  created_at: string;
};

export type AnalyticsSummary = {
  total_clicks: number;
  clicks_today: number;
  clicks_week: number;
  clicks_month: number;
};

export type TopWebsite = {
  id: number;
  name: string;
  slug: string;
  click_count: number;
};

export type TopCategory = {
  website__category__name: string;
  clicks: number;
};

export type RecentClick = {
  id: number;
  type: "website" | "short_link";
  destination: string;
  referrer: string;
  created_at: string;
};

export type AnalyticsDashboard = {
  start_date: string;
  end_date: string;
  summary: AnalyticsSummary;
  daily_clicks: DailyClick[];
  top_websites: TopWebsite[];
  top_categories: TopCategory[];
  recent_clicks: RecentClick[];
};

export type AuthTokens = {
  access: string;
  refresh: string;
  username?: string;
};

