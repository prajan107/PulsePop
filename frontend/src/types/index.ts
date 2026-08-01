export type SentimentType = 'positive' | 'neutral' | 'negative';
export type SourcePlatform = 'Twitter' | 'Reddit' | 'GitHub' | 'ProductHunt' | 'News' | 'YouTube';
export type CategoryType = 'AI & ML' | 'Developer Tools' | 'SaaS' | 'Crypto' | 'E-Commerce' | 'Design';

export interface SentimentBreakdown {
  positive: number; // e.g. 68
  neutral: number;  // e.g. 22
  negative: number; // e.g. 10
}

export interface TimelineDataPoint {
  date: string;
  volume: number;
  sentimentScore: number;
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  platform: SourcePlatform;
  content: string;
  likes: number;
  shares: number;
  timestamp: string;
  sentiment: SentimentType;
  url: string;
}

export interface RelatedTrendItem {
  id: string;
  title: string;
  category: CategoryType;
  growthPercentage: number;
  sentimentScore: number;
}

export interface TrendForecast {
  predictedGrowth30d: number;
  confidenceScore: number; // 0-100
  momentum: 'Explosive' | 'Steady' | 'Waning';
  keyDrivers: string[];
}

export interface Trend {
  id: string;
  title: string;
  category: CategoryType;
  sentimentScore: number; // 0 - 100
  growthPercentage: number;
  volume: number;
  sources: SourcePlatform[];
  summary: string;
  detailedAnalysis: string;
  timeline: TimelineDataPoint[];
  topKeywords: string[];
  topPosts: SocialPost[];
  forecast: TrendForecast;
  relatedTrends: RelatedTrendItem[];
  createdAt: string;
  isHot?: boolean;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: number; // e.g. +14.2 or -3.5
  timeframe: string;
  iconName: string;
  isPositive: boolean;
  description: string;
}

export interface Alert {
  id: string;
  title: string;
  query: string;
  category: CategoryType | 'All Categories';
  platform: SourcePlatform | 'All Platforms';
  threshold: number; // volume threshold e.g. 5000
  triggerCount: number;
  status: 'active' | 'paused';
  lastTriggered: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'system' | 'trend';
  link?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  company: string;
  theme: 'dark' | 'light' | 'system';
  apiKeys: {
    id: string;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
  }[];
  notificationsConfig: {
    emailAlerts: boolean;
    slackAlerts: boolean;
    webhookUrl: string;
    weeklyDigest: boolean;
  };
}

export interface SearchFilterState {
  query: string;
  category: string;
  sentiment: string;
  platform: string;
  dateRange: string;
}
