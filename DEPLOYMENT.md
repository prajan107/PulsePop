# PulsePop AI — Production Deployment Guide

This guide provides instructions for deploying the **PulsePop AI** stack (Frontend, Backend, and PostgreSQL Database) into production environments.

---

## 📋 Architecture & Ports Summary

| Component | Technology | Default Port | Internal Docker Network Name |
| :--- | :--- | :--- | :--- |
| **Frontend** | React / Nginx (Alpine) | `80` (HTTP) | `pulsepop-frontend` |
| **Backend API** | FastAPI / Uvicorn | `8000` | `pulsepop-backend` |
| **Database** | PostgreSQL 16 Alpine | `5432` | `pulsepop-postgres` |

---

## 🔑 Environment Variables Configuration

### Frontend (`frontend/.env.production`)
```env
VITE_API_BASE_URL=/api/v1
```

### Backend (`backend/.env`)
```env
APP_NAME="PulsePop Backend"
APP_VERSION="1.0.0"
DEBUG=false

# Database Configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=pulsepop
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_postgres_password_here

# JWT Auth Configuration
SECRET_KEY=your_super_secret_jwt_signing_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## 🚀 Docker Compose Production Startup

To launch the full stack in detached mode:

```bash
# 1. Clone repository & navigate to root directory
cd PULSEPOP

# 2. Build and launch all services
docker-compose up --build -d
```

### Checking Service Health
```bash
docker-compose ps
```

All three services (`pulsepop-postgres`, `pulsepop-backend`, `pulsepop-frontend`) should display `Up (healthy)` or `Up`.

---

## 🛡️ Nginx & HTTPS Configuration

In production, terminate SSL at an upstream reverse proxy (e.g. Nginx, Cloudflare, Traefik, AWS ALB) or attach Certbot SSL certificates to `pulsepop-frontend`.

### Example Upstream HTTPS Nginx Server Block
```nginx
server {
    listen 443 ssl http2;
    server_name pulsepop.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/pulsepop.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pulsepop.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 🛠️ Operational Troubleshooting

### 1. View Logs
```bash
# Frontend logs
docker-compose logs -f frontend

# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres
```

### 2. Restarting Services
```bash
docker-compose restart frontend
```

### 3. Executing Database Migrations
```bash
docker-compose exec backend alembic upgrade head
```
