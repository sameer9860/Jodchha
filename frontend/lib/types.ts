export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
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
  website: string | null;
  short_link: string | null;
  created_at: string;
};

export type AnalyticsDashboard = {
  summary: AnalyticsSummary;
  daily_clicks: DailyClick[];
  top_websites: TopWebsite[];
  top_categories: TopCategory[];
  recent_clicks: RecentClick[];
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

