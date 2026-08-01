import { Trend, MetricCardData, Alert, NotificationItem, UserProfile } from '../types';

export const MOCK_USER: UserProfile = {
  name: "Alex Vance",
  email: "alex.vance@pulsepop.ai",
  role: "Principal Product Strategist",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Tracking AI breakthroughs, LLM agent frameworks, and developer tool ecosystems.",
  company: "Aether Labs",
  theme: "dark",
  apiKeys: [
    {
      id: "key-1",
      name: "Production Pipeline Key",
      key: "pop_live_9f8a37b2d104e891c28fa",
      created: "2026-05-12",
      lastUsed: "10 mins ago"
    },
    {
      id: "key-2",
      name: "Staging Analytics",
      key: "pop_test_7a12bc94d01e3894a00bc",
      created: "2026-06-01",
      lastUsed: "2 days ago"
    }
  ],
  notificationsConfig: {
    emailAlerts: true,
    slackAlerts: true,
    webhookUrl: "https://hooks.slack.com/services/T00/B00/X00112233",
    weeklyDigest: true
  }
};

export const MOCK_METRICS: MetricCardData[] = [
  {
    id: "metric-1",
    title: "Total Trends Monitored",
    value: "14,892",
    change: 18.4,
    timeframe: "vs. last month",
    iconName: "TrendingUp",
    isPositive: true,
    description: "Active keyword clusters indexed across web platforms"
  },
  {
    id: "metric-2",
    title: "Pulse Velocity Score",
    value: "94.8 / 100",
    change: 5.2,
    timeframe: "vs. last week",
    iconName: "Zap",
    isPositive: true,
    description: "Combined cross-platform virality & acceleration index"
  },
  {
    id: "metric-3",
    title: "Positive Sentiment Ratio",
    value: "76.4%",
    change: 3.1,
    timeframe: "vs. last month",
    iconName: "Smile",
    isPositive: true,
    description: "AI sentiment evaluation score across social mentions"
  },
  {
    id: "metric-4",
    title: "Active Ingestion Sources",
    value: "42",
    change: -1.2,
    timeframe: "stable",
    iconName: "Layers",
    isPositive: false,
    description: "Reddit, GitHub, ProductHunt, X/Twitter & RSS feeds"
  }
];

export const MOCK_TRENDS: Trend[] = [
  {
    id: "trend-1",
    title: "Autonomous Code Refactoring Agents",
    category: "AI & ML",
    sentimentScore: 88,
    growthPercentage: 342.5,
    volume: 128400,
    sources: ["GitHub", "Twitter", "Reddit", "ProductHunt"],
    summary: "Explosive surge in autonomous terminal-driven coding agents utilizing self-debugging tree-of-thought planning loops.",
    detailedAnalysis: "Developers and enterprise engineering teams are heavily adopting terminal-bound LLM agents that autonomously run test suites, analyze build outputs, and perform complex multi-file codebase refactoring. GitHub repositories centered around CLI coding agents have witnessed a 4x increase in star velocity.",
    timeline: [
      { date: "Jul 1", volume: 12000, sentimentScore: 72 },
      { date: "Jul 7", volume: 24500, sentimentScore: 78 },
      { date: "Jul 14", volume: 48000, sentimentScore: 82 },
      { date: "Jul 21", volume: 89000, sentimentScore: 85 },
      { date: "Jul 28", volume: 128400, sentimentScore: 88 }
    ],
    topKeywords: ["Terminal Agent", "Tree of Thought", "Zero-Shot Refactoring", "React 19 Hooks", "Vite Plugin", "AST Mutation"],
    topPosts: [
      {
        id: "post-1",
        author: "Sarah Chen",
        handle: "@sarah_ai_dev",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        platform: "Twitter",
        content: "Just ran an autonomous refactoring agent across 45,000 lines of legacy TypeScript. Converted all class components to full React 19 hooks and passing unit tests in 3 minutes flat! 🚀 #AI #Coding",
        likes: 4210,
        shares: 890,
        timestamp: "2 hours ago",
        sentiment: "positive",
        url: "https://twitter.com"
      },
      {
        id: "post-2",
        author: "DevPulse Weekly",
        handle: "r/LocalLLaMA",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
        platform: "Reddit",
        content: "Benchmarking terminal agents against traditional IDE extensions: standard latency dropped by 64% while multi-file context retention improved by 3.2x.",
        likes: 1850,
        shares: 340,
        timestamp: "5 hours ago",
        sentiment: "positive",
        url: "https://reddit.com"
      }
    ],
    forecast: {
      predictedGrowth30d: 85.0,
      confidenceScore: 94,
      momentum: "Explosive",
      keyDrivers: ["Open-source weights release", "VSCode extension integrations", "Enterprise DevSecOps budget allocation"]
    },
    relatedTrends: [
      { id: "trend-2", title: "Local Browser-based LLM Inference", category: "AI & ML", growthPercentage: 184.2, sentimentScore: 82 },
      { id: "trend-3", title: "WebGPU Accelerated Canvas", category: "Developer Tools", growthPercentage: 112.0, sentimentScore: 79 }
    ],
    createdAt: "2026-07-29",
    isHot: true
  },
  {
    id: "trend-2",
    title: "Local WebGPU Browser Inference",
    category: "AI & ML",
    sentimentScore: 84,
    growthPercentage: 198.4,
    volume: 86200,
    sources: ["GitHub", "Twitter", "News"],
    summary: "Running 7B parameter vision-language models directly inside client web browsers via WebGPU without backend server costs.",
    detailedAnalysis: "With WebGPU becoming ubiquitous across all modern web browsers, client-side neural network inference has unlocked privacy-first SaaS capabilities. Applications process confidential PDF docs and video streams directly on client hardware.",
    timeline: [
      { date: "Jul 1", volume: 14000, sentimentScore: 75 },
      { date: "Jul 7", volume: 29000, sentimentScore: 77 },
      { date: "Jul 14", volume: 45000, sentimentScore: 80 },
      { date: "Jul 21", volume: 68000, sentimentScore: 83 },
      { date: "Jul 28", volume: 86200, sentimentScore: 84 }
    ],
    topKeywords: ["WebGPU", "ONNX Runtime Web", "Zero Latency", "Wasm SIMD", "Privacy-first AI"],
    topPosts: [
      {
        id: "post-3",
        author: "Marcus Thorne",
        handle: "@mthorne_gpu",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        platform: "Twitter",
        content: "Browser-side AI is now faster than API roundtrips! Token generation speed hit 48 tokens/sec locally on M3 Max using WebGPU.",
        likes: 3100,
        shares: 512,
        timestamp: "4 hours ago",
        sentiment: "positive",
        url: "https://twitter.com"
      }
    ],
    forecast: {
      predictedGrowth30d: 62.0,
      confidenceScore: 89,
      momentum: "Steady",
      keyDrivers: ["Quantization improvements", "Browser hardware acceleration support"]
    },
    relatedTrends: [
      { id: "trend-1", title: "Autonomous Code Refactoring Agents", category: "AI & ML", growthPercentage: 342.5, sentimentScore: 88 }
    ],
    createdAt: "2026-07-28",
    isHot: true
  },
  {
    id: "trend-3",
    title: "Zero-Latency Realtime Audio AI",
    category: "SaaS",
    sentimentScore: 91,
    growthPercentage: 275.8,
    volume: 110500,
    sources: ["ProductHunt", "Twitter", "YouTube"],
    summary: "Full-duplex conversational voice interfaces operating under 150ms total turn-taking delay.",
    detailedAnalysis: "Real-time speech-to-speech models are revolutionizing customer service, language tutoring, and executive assistant tools. The transition from cascading STT-LLM-TTS pipelines to native multimodal audio transformers has eliminated latency bottlenecks.",
    timeline: [
      { date: "Jul 1", volume: 9000, sentimentScore: 80 },
      { date: "Jul 7", volume: 22000, sentimentScore: 84 },
      { date: "Jul 14", volume: 51000, sentimentScore: 88 },
      { date: "Jul 21", volume: 82000, sentimentScore: 90 },
      { date: "Jul 28", volume: 110500, sentimentScore: 91 }
    ],
    topKeywords: ["Full Duplex Voice", "Multimodal Audio", "Sub-150ms", "WebSockets", "Streaming Audio Tokenizer"],
    topPosts: [
      {
        id: "post-4",
        author: "Elena Rostova",
        handle: "@elena_design",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        platform: "ProductHunt",
        content: "Launched VocalPulse today! Experience fluid human-AI voice conversation with instant interjection handling.",
        likes: 1420,
        shares: 280,
        timestamp: "1 day ago",
        sentiment: "positive",
        url: "https://producthunt.com"
      }
    ],
    forecast: {
      predictedGrowth30d: 92.5,
      confidenceScore: 96,
      momentum: "Explosive",
      keyDrivers: ["Native multimodal API endpoints", "Mobile SDK rollout"]
    },
    relatedTrends: [
      { id: "trend-1", title: "Autonomous Code Refactoring Agents", category: "AI & ML", growthPercentage: 342.5, sentimentScore: 88 }
    ],
    createdAt: "2026-07-27",
    isHot: true
  },
  {
    id: "trend-4",
    title: "Declarative React 19 Server Actions",
    category: "Developer Tools",
    sentimentScore: 78,
    growthPercentage: 145.2,
    volume: 64100,
    sources: ["GitHub", "Reddit", "Twitter"],
    summary: "Standardization of form handling and mutation states using native React 19 directives and useActionState.",
    detailedAnalysis: "Frontend architects are refactoring large single-page web apps to adopt React 19 action primitives, simplifying boilerplate form validations and optimistic state rollbacks without manual store mutations.",
    timeline: [
      { date: "Jul 1", volume: 18000, sentimentScore: 72 },
      { date: "Jul 7", volume: 28000, sentimentScore: 74 },
      { date: "Jul 14", volume: 41000, sentimentScore: 76 },
      { date: "Jul 21", volume: 53000, sentimentScore: 77 },
      { date: "Jul 28", volume: 64100, sentimentScore: 78 }
    ],
    topKeywords: ["React 19", "useActionState", "Optimistic UI", "TypeSafe Forms", "Zod Validation"],
    topPosts: [
      {
        id: "post-5",
        author: "Dan Abramov Fan",
        handle: "r/reactjs",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        platform: "Reddit",
        content: "React 19 form actions combined with shadcn UI components remove 500+ lines of custom state handlers.",
        likes: 940,
        shares: 110,
        timestamp: "3 days ago",
        sentiment: "positive",
        url: "https://reddit.com"
      }
    ],
    forecast: {
      predictedGrowth30d: 40.0,
      confidenceScore: 91,
      momentum: "Steady",
      keyDrivers: ["Vite ecosystem plugin support", "Framework consensus"]
    },
    relatedTrends: [
      { id: "trend-5", title: "Vector Database Native Indexing", category: "SaaS", growthPercentage: 88.4, sentimentScore: 76 }
    ],
    createdAt: "2026-07-25"
  },
  {
    id: "trend-5",
    title: "Vector Database Native Hybrid Indexing",
    category: "SaaS",
    sentimentScore: 76,
    growthPercentage: 88.4,
    volume: 52300,
    sources: ["GitHub", "News"],
    summary: "Combining sparse keyword BM25 search with dense vector embeddings into single atomic database queries.",
    detailedAnalysis: "Enterprise RAG deployments are abandoning split search architectures in favor of unified hybrid vector databases, reducing retrieval error rates by 38%.",
    timeline: [
      { date: "Jul 1", volume: 20000, sentimentScore: 70 },
      { date: "Jul 7", volume: 28000, sentimentScore: 72 },
      { date: "Jul 14", volume: 37000, sentimentScore: 74 },
      { date: "Jul 21", volume: 44000, sentimentScore: 75 },
      { date: "Jul 28", volume: 52300, sentimentScore: 76 }
    ],
    topKeywords: ["BM25 Hybrid", "Dense Embeddings", "RAG Pipeline", "Vector Search", "Recall Optimization"],
    topPosts: [
      {
        id: "post-6",
        author: "DataEngine",
        handle: "@dataengine_io",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        platform: "News",
        content: "Benchmark comparison of hybrid vector search vs pure semantic search across 10M enterprise documents.",
        likes: 620,
        shares: 95,
        timestamp: "4 days ago",
        sentiment: "positive",
        url: "https://news.ycombinator.com"
      }
    ],
    forecast: {
      predictedGrowth30d: 25.0,
      confidenceScore: 87,
      momentum: "Steady",
      keyDrivers: ["Enterprise data security requirements"]
    },
    relatedTrends: [
      { id: "trend-4", title: "Declarative React 19 Server Actions", category: "Developer Tools", growthPercentage: 145.2, sentimentScore: 78 }
    ],
    createdAt: "2026-07-20"
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert-1",
    title: "Autonomous Agent Spike Alert",
    query: "Autonomous Code Refactoring Agents",
    category: "AI & ML",
    platform: "All Platforms",
    threshold: 100000,
    triggerCount: 14,
    status: "active",
    lastTriggered: "2 hours ago",
    createdAt: "2026-07-15"
  },
  {
    id: "alert-2",
    title: "WebGPU Latency Monitor",
    query: "WebGPU client inference",
    category: "Developer Tools",
    platform: "GitHub",
    threshold: 50000,
    triggerCount: 8,
    status: "active",
    lastTriggered: "1 day ago",
    createdAt: "2026-07-18"
  },
  {
    id: "alert-3",
    title: "React 19 Breaking API Changes",
    query: "React 19 Server Actions",
    category: "Developer Tools",
    platform: "Reddit",
    threshold: 25000,
    triggerCount: 3,
    status: "paused",
    lastTriggered: "5 days ago",
    createdAt: "2026-07-10"
  },
  {
    id: "alert-4",
    title: "SaaS Conversational Voice Surge",
    query: "Sub-150ms Voice AI",
    category: "SaaS",
    platform: "ProductHunt",
    threshold: 75000,
    triggerCount: 21,
    status: "active",
    lastTriggered: "30 mins ago",
    createdAt: "2026-07-01"
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Alert Triggered: Autonomous Agent Spike",
    message: "Mention volume exceeded your threshold of 100,000 across Twitter and GitHub.",
    timestamp: "10 mins ago",
    read: false,
    type: "alert",
    link: "/trends/trend-1"
  },
  {
    id: "notif-2",
    title: "New Hot Trend Detected: Zero-Latency Realtime Audio",
    message: "Growth velocity reached +275.8% in category SaaS.",
    timestamp: "1 hour ago",
    read: false,
    type: "trend",
    link: "/trends/trend-3"
  },
  {
    id: "notif-3",
    title: "System Update: Ingestion Engine V2.4 Live",
    message: "Added automated sentiment classification for YouTube transcript streams.",
    timestamp: "1 day ago",
    read: true,
    type: "system"
  }
];

export const MOCK_CHART_DATA = {
  growthLine: [
    { date: "Jul 1", "AI & ML": 32000, "Developer Tools": 18000, "SaaS": 24000 },
    { date: "Jul 7", "AI & ML": 48000, "Developer Tools": 22000, "SaaS": 31000 },
    { date: "Jul 14", "AI & ML": 76000, "Developer Tools": 34000, "SaaS": 49000 },
    { date: "Jul 21", "AI & ML": 115000, "Developer Tools": 48000, "SaaS": 78000 },
    { date: "Jul 28", "AI & ML": 164000, "Developer Tools": 64000, "SaaS": 112000 },
  ],
  sentimentPie: [
    { name: "Positive", value: 68, color: "#10B981" },
    { name: "Neutral", value: 22, color: "#6366F1" },
    { name: "Negative", value: 10, color: "#EF4444" },
  ],
  sourceDistribution: [
    { source: "Twitter / X", count: 48200, percentage: 38 },
    { source: "GitHub", count: 32400, percentage: 26 },
    { source: "Reddit", count: 24100, percentage: 19 },
    { source: "ProductHunt", count: 12800, percentage: 10 },
    { source: "News / Blogs", count: 8900, percentage: 7 },
  ],
  categoryDistribution: [
    { category: "AI & ML", count: 42, color: "#6366F1" },
    { category: "SaaS", count: 28, color: "#10B981" },
    { category: "Developer Tools", count: 18, color: "#3B82F6" },
    { category: "E-Commerce", count: 8, color: "#F59E0B" },
    { category: "Design", count: 4, color: "#EC4899" },
  ]
};

export const MOCK_TRENDING_KEYWORDS = [
  { text: "Autonomous Agents", weight: 98, isHot: true },
  { text: "WebGPU Inference", weight: 89, isHot: true },
  { text: "React 19 Server Actions", weight: 84, isHot: false },
  { text: "Sub-150ms Audio", weight: 79, isHot: true },
  { text: "Hybrid Vector Search", weight: 72, isHot: false },
  { text: "Zero-Shot Refactoring", weight: 68, isHot: false },
  { text: "Wasm SIMD", weight: 62, isHot: false },
  { text: "Tree-of-Thought", weight: 58, isHot: false }
];

export const MOCK_TOP_CATEGORIES = [
  { name: "AI & ML", count: 142, growth: "+34.8%", color: "bg-indigo-500" },
  { name: "SaaS Applications", count: 98, growth: "+22.4%", color: "bg-emerald-500" },
  { name: "Developer Ecosystem", count: 76, growth: "+18.2%", color: "bg-blue-500" },
  { name: "Design & UX", count: 34, growth: "+8.6%", color: "bg-pink-500" }
];
