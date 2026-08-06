# 🚀 InsightFlow

> Enterprise-Grade AI Trend Intelligence Platform

InsightFlow is a full-stack AI-powered Trend Intelligence Platform that collects, analyzes, clusters, scores, and visualizes trending topics from multiple online sources using Large Language Models and modern data engineering practices.

Built with a scalable microservice-inspired architecture using FastAPI, React, PostgreSQL, Docker, and Google's Gemini AI.

---

# ✨ Features

## Authentication

- JWT Authentication
- Secure Login/Register
- Password Hashing
- Protected Routes
- Session Management

---

## AI Pipeline

- AI-powered Trend Analysis
- Entity Extraction
- Sentiment Analysis
- Topic Classification
- Duplicate Detection
- Trend Correlation
- Trend Scoring
- Trend Materialization

---

## Data Collection

Currently Supported

- ✅ Google Trends (PyTrends)

Planned

- Reddit
- YouTube
- News API
- GitHub Trending
- Hacker News
- RSS Feeds

---

## Dashboard

- Trend Overview
- Analytics
- Monitoring
- Trend Explorer
- Search
- Health Monitoring

---

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy (Async)
- PostgreSQL
- Alembic
- APScheduler
- Pydantic v2
- JWT
- Passlib / Argon2
- Loguru

### AI

- Google Gemini
- Embeddings
- AI Processing Pipeline

### Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- TanStack Query
- Zustand
- React Router
- Recharts
- Axios

### DevOps

- Docker
- Docker Compose
- Nginx

---

# Architecture

```
                Google Trends
                       │
                       ▼
            GoogleTrendsCollector
                       │
                       ▼
                 RawTrend Table
                       │
                       ▼
             AI Processing Pipeline
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  Entity Extraction  Sentiment   Topic Detection
                       │
                       ▼
              TrendAnalysis Table
                       │
                       ▼
          TrendCorrelationService
                       │
                       ▼
            TrendScoringService
                       │
                       ▼
          TrendMaterializerService
                       │
                       ▼
                  Trend Table
                       │
                       ▼
               REST API (FastAPI)
                       │
                       ▼
             React + TanStack Query
                       │
                       ▼
                 Dashboard UI
```

---

# Project Structure

```
InsightFlow/

├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── collectors/
│   │   ├── core/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── scheduler/
│   │   ├── services/
│   │   └── utils/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/<username>/InsightFlow.git

cd InsightFlow
```

---

# Environment Variables

Create

```
backend/.env
```

Example

```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=pulsepop
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=

NEWS_API_KEY=

YOUTUBE_API_KEY=
```

---

# Running with Docker

```bash
docker compose up --build
```

---

Frontend

```
http://localhost
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Database

Uses

- PostgreSQL
- SQLAlchemy Async
- Alembic

Run migrations

```bash
alembic upgrade head
```

Create migration

```bash
alembic revision --autogenerate -m "message"
```

---

# API Modules

Authentication

```
/api/v1/auth
```

Users

```
/api/v1/users
```

Trends

```
/api/v1/trends
```

Analytics

```
/api/v1/analytics
```

Monitoring

```
/api/v1/monitoring
```

Dashboard

```
/api/v1/dashboard
```

Health

```
/health
```

---

# Current Workflow

```
Collectors
      │
      ▼
Raw Trends
      │
      ▼
AI Analysis
      │
      ▼
Trend Analysis
      │
      ▼
Correlation
      │
      ▼
Trend Scoring
      │
      ▼
Trend Materializer
      │
      ▼
Trend Repository
      │
      ▼
REST API
      │
      ▼
Frontend
```

---

# Development Workflow

1. Create feature branch

```bash
git checkout -b feature/new-feature
```

2. Commit changes

```bash
git add .

git commit -m "Implement new feature"
```

3. Push

```bash
git push origin feature/new-feature
```

4. Open Pull Request

---

# Testing

Backend

```bash
pytest
```

Frontend

```bash
npm test
```

---

# Roadmap

### Sprint 1–8 ✅

- Project Foundation
- Docker
- Authentication
- Database
- CRUD APIs
- Collectors
- Scheduler
- AI Pipeline
- Dashboard
- Trend Explorer
- Monitoring
- Search
- Analytics
- Google Trends Integration

### Sprint 9

- Reddit Integration
- YouTube Integration
- News Integration
- GitHub Trending
- Multi-source Trend Correlation
- Real-time Updates
- AI Trend Forecasting

### Sprint 10

- Redis Caching
- Prometheus
- Grafana
- OpenTelemetry
- Kubernetes Deployment
- CI/CD Pipeline

---

# Contributors

Project Owner

- Rajan Prajapati

Contributors

- Add your contributors here

---

# License

MIT License

---

# Acknowledgements

- FastAPI
- React
- PostgreSQL
- SQLAlchemy
- Docker
- Google Gemini
- PyTrends
- TanStack Query
- TailwindCSS
