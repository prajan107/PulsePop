export interface Trend {
  id: number;
  title: string;
  summary?: string | null;
  category_id?: number | null;
  source_id?: number | null;
  sentiment_score: number;
  trend_score: number;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface TrendListResponse {
  items: Trend[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TrendFilterParams {
  search?: string;
  category_id?: number;
  source_id?: number;
  minimum_trend_score?: number;
  minimum_popularity_score?: number;
  sort_by?: 'created_at' | 'trend_score' | 'popularity_score' | string;
  order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}
