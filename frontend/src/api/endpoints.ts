export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    TOP_TRENDS: '/analytics/top-trends',
    TOPICS: '/analytics/topics',
    ENTITIES: '/analytics/entities',
    SENTIMENT: '/analytics/sentiment',
    SOURCES: '/analytics/sources',
  },
  TRENDS: {
    LIST: '/trends',
    DETAIL: (id: number | string) => `/trends/${id}`,
  },
  MONITORING: {
    METRICS: '/monitoring/metrics',
    HEALTH: '/monitoring/health',
  },
} as const;
