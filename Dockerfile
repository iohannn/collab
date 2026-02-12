# syntax=docker/dockerfile:1.6

ARG PYTHON_VERSION=3.11
ARG NODE_VERSION=20

# -----------------------------
# Frontend build stage (CRA)
# -----------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS frontend-builder
WORKDIR /app/frontend

# Install dependencies first for better layer caching
COPY frontend/package.json frontend/yarn.lock* ./
RUN corepack enable \
    && if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else yarn install; fi

# Build static assets
COPY frontend/ .
ENV CI=false
RUN yarn build

# -----------------------------
# Backend build stage (FastAPI)
# -----------------------------
FROM python:${PYTHON_VERSION}-slim AS backend-builder
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app/backend

# System deps for common Python wheels (bcrypt/cryptography, etc.)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libffi-dev \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# -----------------------------
# Backend runtime target
# -----------------------------
FROM backend-builder AS backend
WORKDIR /app/backend
COPY backend/ .

EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]

# -----------------------------
# Frontend runtime target (Nginx)
# -----------------------------
FROM nginx:1.25-alpine AS frontend
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# -----------------------------
# Full stack runtime target (Nginx + Uvicorn via Supervisor)
# -----------------------------
FROM python:${PYTHON_VERSION}-slim AS full
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app

# Nginx for static hosting + reverse proxy, Supervisor to run both processes
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
        supervisor \
        libssl3 \
        libffi8 \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

# Python deps from builder + app code
COPY --from=backend-builder /usr/local /usr/local
COPY backend/ /app/backend

# Frontend static assets
COPY --from=frontend-builder /app/frontend/build /var/www/frontend

# Nginx config (serves frontend, proxies /api to backend)
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;

    root /var/www/frontend;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri /index.html;
    }
}
EOF

# Supervisor config to run both Uvicorn and Nginx
RUN cat <<'EOF' > /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true

[program:backend]
directory=/app/backend
command=uvicorn server:app --host 0.0.0.0 --port 8000
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

EXPOSE 80 8000
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
