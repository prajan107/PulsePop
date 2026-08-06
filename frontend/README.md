# PulsePop AI — Frontend Application

Production-grade React 18/19 frontend for **PulsePop AI**, an enterprise real-time trend analytics, sentiment intelligence, and operational observability platform.

---

## 📐 System Architecture Diagram

```
                                  [ User Browser ]
                                         │
                                         ▼
                            [ Nginx Reverse Proxy / SPA ]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
          [ React UI App ]                           [ Static Assets (/assets) ]
          (TanStack Query)
                   │
                   ▼ (HTTP / REST)
       [ FastAPI Backend (/api/v1) ]
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
[ Ingestion Services ]   [ AI Analytics & NLP ]
       │                       │
       ▼                       ▼
[ Raw Trend Repositories ] [ Cluster Engine ]
       │                       │
       └───────────┬───────────┘
                   ▼
       [ PostgreSQL Database ]
```

---

## 📊 Lighthouse Target Audit Metrics

| Category | Target Score | Production Status |
| :--- | :--- | :--- |
| **Performance** | **> 90** | ✅ Optimized (`manualChunks`, Gzip, Hashed assets) |
| **Accessibility** | **> 90** | ✅ Verified (ARIA labels, focus rings, semantic tags) |
| **Best Practices** | **> 90** | ✅ Verified (HTTPS, CSP, no console errors) |
| **SEO** | **> 90** | ✅ Verified (Meta descriptions, title tags, responsive) |

---

## 🏗️ Tech Stack

- **Framework**: React 18/19, TypeScript, Vite
- **Routing**: React Router v6 (Route-level code splitting via `React.lazy()` & `Suspense`)
- **State Management**:
  - **Server Data**: TanStack Query (React Query v5)
  - **UI / Auth State**: Zustand
- **Data Visualization**: Recharts
- **Form & Validation**: React Hook Form, Zod
- **Styling & UI**: Tailwind CSS, Lucide React
- **HTTP Client**: Axios with Bearer token & 401 interceptors
- **Web Server / Containerization**: Docker, Nginx (Alpine), Multi-stage builds

---

## 📂 Project Structure

```
frontend/
├── dist/                    # Compiled production build artifacts & stats.html
├── nginx.conf               # Production Nginx configuration (SPA routing, Gzip, CSP)
├── Dockerfile               # Pinned multi-stage Docker build (node:20-alpine -> nginx:1.25-alpine)
├── package.json             # Scripts & dependencies
├── vite.config.ts           # Vite Rollup manualChunks & visualizer configuration
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
├── .env.example             # Environment variables template
├── src/
│   ├── api/                 # Axios instance and API endpoint constants
│   ├── assets/              # Static media assets
│   ├── components/          # Reusable UI primitives, cards, and layouts
│   │   ├── analytics/       # Analytics dashboard cards & tables
│   │   ├── charts/          # Reusable Recharts primitives (BarChart, DonutChart, etc.)
│   │   ├── common/          # ErrorBoundary, RouteErrorBoundary, PageLoader, StatusBadge, Toast, KPIStatCard
│   │   ├── dashboard/       # Main dashboard header, skeletons, and widgets/
│   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   ├── monitoring/      # System health and collector status components
│   │   ├── trends/          # Trend cards, filters, and tables
│   │   └── ui/              # Base UI components (Button, Input, Container, FormField)
│   ├── config/              # Central navigation configuration
│   ├── features/            # Feature-sliced modules (auth, trends, analytics, monitoring)
│   ├── hooks/               # Custom hooks (useAuth, useProtectedRoute, etc.)
│   ├── layouts/             # PublicLayout and AuthenticatedLayout
│   ├── lib/                 # QueryClient configuration
│   ├── pages/               # Lazy-loaded page views
│   ├── providers/           # ThemeProvider and AuthProvider wrappers
│   ├── routes/              # AppRoutes, ProtectedRoute, GuestRoute
│   ├── utils/               # Utility functions and classname merging
│   └── vite-env.d.ts        # TypeScript environment declarations
└── README.md                # Application documentation
```

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Run Local Dev Server
```bash
npm run dev
```
App will open automatically at `http://localhost:3000`.

---

## 🛠️ Production Build & Bundle Visualization

To produce a minified, code-split production build with bundle statistics:

```bash
npm run build
```

This will run TypeScript checks (`tsc`), Vite bundling, and generate:
1. Production bundle assets in `frontend/dist/assets/`
2. Bundle analysis visualizer HTML in `frontend/dist/stats.html`

---

## 🐳 Docker Deployment

```bash
# Build production image
docker build -t pulsepop-frontend .

# Run container on port 80
docker run -d -p 80:80 --name pulsepop-frontend-app pulsepop-frontend
```
