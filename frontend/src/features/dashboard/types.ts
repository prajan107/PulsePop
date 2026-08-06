export interface AnalyticsOverview {
  total_raw_trends: number;
  total_clusters: number;
  average_trend_score: number;
  average_sentiment_confidence: number;
  average_processing_time_ms: number;
  top_trending_topic?: string | null;
  top_source?: string | null;
  average_cluster_size?: number;
  completed_analyses?: number;
  failed_analyses?: number;
}

export interface TopTrend {
  id: number;
  canonical_title: string;
  canonical_summary?: string | null;
  cluster_key: string;
  trend_score: number;
  popularity_score: number;
  freshness_score: number;
  source_diversity_score: number;
  sentiment_score: number;
  trend_count: number;
  created_at: string;
  updated_at: string;
}
