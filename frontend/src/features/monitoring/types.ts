export interface SystemMetrics {
  application: {
    app_name: string;
    version: string;
    pipeline_version: string;
    python_version: string;
    platform: string;
    uptime_seconds: number;
    start_time: string;
  };
  collectors: {
    requests: number;
    failures: number;
  };
  ai: {
    raw_trends_processed: number;
    completed_analyses: number;
    failed_analyses: number;
    average_processing_time_ms: number;
  };
  clusters: {
    correlations: number;
    clusters: number;
  };
}

export interface HealthStatus {
  application: {
    name: string;
    version: string;
    pipeline_version: string;
    python_version: string;
    uptime_seconds: number;
  };
  database: {
    status: 'healthy' | 'unhealthy' | string;
  };
  scheduler: {
    status: 'healthy' | 'stopped' | string;
  };
  ai_provider: {
    status: 'healthy' | 'degraded' | 'unhealthy' | string;
  };
  collectors: {
    status: 'healthy' | 'unhealthy' | string;
  };
}
