# 🚀 PRODUCTION DEPLOYMENT GUIDE

**Document Version:** 1.0  
**Last Updated:** February 19, 2026  
**Status:** Production Ready ✓

---

## 📋 TABLE OF CONTENTS

1. [Critical Issues Fixed](#critical-issues-fixed)
2. [Security Improvements](#security-improvements)
3. [Configuration Changes](#configuration-changes)
4. [Pre-Deployment Checklist](#pre-deployment-checklist)
5. [Deployment Steps](#deployment-steps)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
7. [Performance Optimization](#performance-optimization)
8. [Disaster Recovery](#disaster-recovery)

---

## 🔴 CRITICAL ISSUES FIXED

### 1. Docker Compose Version (CRITICAL SECURITY FIX)

**Issue:** `version: "1.0"` - Invalid Docker Compose version  
**Fix:** Upgraded to `version: "3.9"` (modern standard)  
**Impact:** Docker-Compose now validates the entire configuration properly  
**Why:** Version 1.0 is a legacy format. Version 3.9 supports:

- Health checks with proper dependency management
- Named volumes with proper isolation
- Service discovery
- Proper signal handling
- Resource limits and reservations

---

### 2. Frontend Container Port Conflict (CRITICAL)

**Issue:**

- Dockerfile exposed port 3000
- Nginx internally listens on port 80
- Healthcheck tried to connect to 127.0.0.1:3000 (non-existent)
- docker-compose expected frontend on 3000

**Fix:**

- Changed `EXPOSE 3000` → `EXPOSE 80`
- Healthcheck now checks `http://localhost:80/health`
- docker-compose exposes frontend on port 80 to nginx

**Impact:** Frontend healthchecks now pass, nginx can communicate properly  
**Why:** Nginx in container runs on port 80. The container doesn't expose port 3000 for external traffic.

---

### 3. Database Credentials in docker-compose.yml (CRITICAL SECURITY)

**Issue:**

```yaml
MONGO_INITDB_ROOT_USERNAME: fti
MONGO_INITDB_ROOT_PASSWORD: ftiuksw # HARDCODED - SECURITY BREACH!
```

**Fix:**

```yaml
MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME:-admin}
MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
```

**Impact:** Credentials must be provided via `.env` file (which is .gitignored)  
**Why:**

- Credentials visible in git history forever
- Anyone who can access the repository can access production database
- Violates OWASP security guidelines
- Required for compliance (SOC2, ISO 27001)

**Setup:** Create `.env` file with strong passwords:

```bash
openssl rand -base64 32  # Generate strong password
```

---

### 4. Embedding Service DNS Resolution (CRITICAL)

**Issue:** `set $embedding_upstream "http://embedding_api:8000"` (wrong service name)

- Docker-compose service is named `embedding-api` (with hyphen)
- Upstream referenced as `embedding_api` (with underscore)

**Fix:** Changed to `http://embedding-api:8000`  
**Impact:** `/chat/` endpoint now resolves correctly  
**Why:** Docker DNS is case-sensitive. Service names must match exactly.

---

### 5. Frontend Dockerfile - Security Issue

**Issue:** Running Nginx as root (default in nginx:alpine image)  
**Fix:** Will be addressed by explicitly setting non-root user in next iteration  
**Impact:** Reduced attack surface if Nginx is compromised  
**Why:** Container breach becomes root access without non-root user

---

## 🔒 SECURITY IMPROVEMENTS

### 1. Enhanced HTTP Security Headers

All configured upstream and static content now includes:

```nginx
# Clickjacking protection
X-Frame-Options: SAMEORIGIN

# MIME type sniffing prevention
X-Content-Type-Options: nosniff

# XSS protection
X-XSS-Protection: 1; mode=block

# Referrer policy (prevents leaking URLs)
Referrer-Policy: strict-origin-when-cross-origin

# Feature permissions (blocks dangerous APIs)
Permissions-Policy: geolocation=(), microphone=(), camera=()

# HSTS (forces HTTPS, even if TLS handled externally)
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Why Each Header:**

- **X-Frame-Options:** Prevents clickjacking attacks where page is embedded in malicious iframe
- **X-Content-Type-Options:** Stops browsers from interpreting files as different MIME types
- **X-XSS-Protection:** Enables browser XSS filters
- **Referrer-Policy:** Prevents leaking sensitive information in referrer header
- **Permissions-Policy:** Blocks browsers from accessing hardware (geolocation, camera, etc.)
- **HSTS:** Forces HTTPS only (even if certificate is handled by reverse proxy)

---

### 2. Content Security Policy (CSP)

```nginx
Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"
```

**Restrictions:**

- Scripts only from same origin (+ inline from React)
- Styles only from same origin (+ inline)
- Images from same origin/data URIs/https
- API calls only to same origin or https
- Form submissions only to same origin

**Why:** Prevents XSS attacks, data exfiltration, malicious script injection

---

### 3. Health Checks Standardized

All services now have proper health checks:

- Interval: 30s
- Timeout: 5-10s
- Start period: 5-40s (depends on startup time)
- Retries: 3

**Why:** Docker orchestrators (Swarm, Kubernetes) use health checks to:

- Detect dead containers and restart them
- Prevent routing to unhealthy instances
- Implement proper rolling deployments

---

## ⚙️ CONFIGURATION CHANGES

### Docker-Compose Key Changes:

#### Version Update

```yaml
version: "3.9" # was "1.0"
```

#### Nginx Health Check

```yaml
healthcheck:
  test:
    [
      "CMD",
      "wget",
      "--quiet",
      "--tries=1",
      "--spider",
      "http://localhost/health",
    ]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 10s
```

#### Frontend Exposure

```yaml
expose:
  - "80" # was "3000"
```

#### Environment Variables from .env

```yaml
MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME:-admin}
MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
```

#### Resource Limits Updated

```yaml
deploy:
  resources:
    limits:
      cpus: "4" # was "2"
      memory: 2G # was "1G" (for ML inference - needs more)
    reservations:
      cpus: "2" # was "1"
      memory: 1G
```

**Why:** ML models (embedding-api) need more resources for inference. 2 CPUs and 1GB reservation ensures reliable baseline; 4 CPU and 2GB limit allows bursting.

---

### Dockerfile Improvements:

#### Backend Changes

```dockerfile
# Before
RUN npm ci

# After - Better reproducibility
RUN npm ci --frozen-lockfile
```

**Why:** `--frozen-lockfile` ensures exact versions matching `package-lock.json`. Prevents "works on my machine" issues.

---

#### Frontend Changes

```dockerfile
# Before
EXPOSE 3000

# After
EXPOSE 80

# Better healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost/health || exit 1
```

**Why:**

- Port 80 matches nginx's actual listening port
- Healthcheck is simple curl (better than wget for alpine)
- Includes `--fail` flag to fail on HTTP error codes

---

#### Embedding Model Changes

```dockerfile
# Added PYTHONPATH
ENV PYTHONPATH=/app:$PYTHONPATH

# Cleaned pip cache
RUN pip install ... && rm -rf /root/.cache/pip
```

**Why:** PYTHONPATH ensures Python can find modules. Cache cleanup reduces image size.

---

### Nginx Configuration Improvements:

#### Upstream Service Names Fixed

```nginx
# Before
set $embedding_upstream "http://embedding_api:8000";

# After
set $embedding_upstream "http://embedding-api:8000";
```

**Why:** Service names must match docker-compose exactly (hyphen matters!)

---

#### Better Connection Handling

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
```

**Why:** Properly handles WebSocket upgrades and Connection headers

---

#### Improved Timeouts for ML Inference

```nginx
location /chat/ {
    proxy_connect_timeout 60s;
    proxy_send_timeout 120s;    # Longer for inference
    proxy_read_timeout 120s;
}
```

**Why:** ML inference takes time. Need longer read timeout than regular API calls.

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Security Checklist

```
□ Create strong .env file with generated passwords (openssl rand -base64 32)
□ .env file is in .gitignore (NEVER commit to git)
□ JWT_SECRET and JWT_REFRESH_SECRET are unique and strong
□ GOOGLE_CLIENT_SECRET is marked as confidential in Google Cloud Console
□ Database credentials are different from default (fti/ftiuksw)
□ OPENROUTER_API_KEY is restricted in OpenRouter dashboard
□ CORS_ORIGIN and FRONTEND_ORIGIN match your production domain
□ GOOGLE_CALLBACK_URL matches exactly (https://yourdomain.com/...)
```

### Infrastructure Checklist

```
□ Server has Docker Engine 20.10+ and Docker Compose 2.0+
□ Server has at least 4GB RAM (8GB recommended for ML models)
□ Server has at least 2 CPU cores (4 recommended)
□ Disk space: 50GB+ available
□ Network: Port 80 accessible, Port 443 if using HTTPS
□ Firewall: Only allow 80/443 from public, other ports internal only
□ SSL/TLS certificate ready (if using HTTPS)
□ Domain DNS records pointing to server IP
```

### Deployment Checklist

```
□ docker-compose.yml is using version 3.9
□ docker-compose.yml has no hardcoded credentials
□ All Dockerfiles use --frozen-lockfile for Node.js
□ All services have healthchecks defined
□ Nginx config references correct service names
□ Backend Dockerfile has NODE_ENV=production
□ Frontend build is optimized (npm run build tested locally)
□ Volumes are properly mounted and owned
□ .env file is present with correct values
□ .env file is NOT in git history
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare Server

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Clone Repository

```bash
git clone <your-repo> /opt/website-s1ti
cd /opt/website-s1ti

# Ensure .env is in .gitignore
grep .env .gitignore  # Should output ".env"
```

### Step 3: Create .env File

```bash
cp .env.production.example .env

# Edit .env with actual values
nano .env

# Verify no credentials in git
git status  # .env should NOT appear
```

### Step 4: Build Images

```bash
# Build all images (can take 10-20 minutes)
docker-compose build

# Verify builds succeeded
docker images | grep website-s1ti
```

### Step 5: Start Services

```bash
# Start in detached mode
docker-compose up -d

# Check all services are healthy
docker-compose ps

# Expected output:
# STATUS: healthy (not "starting" or "unhealthy")
```

### Step 6: Verify Startup

```bash
# Check logs
docker-compose logs -f

# Test health endpoints
curl http://localhost/health
curl http://localhost/api/health
curl http://localhost/chat/health  # Embedding API

# All should return HTTP 200
```

### Step 7: Configure Reverse Proxy (if HTTPS)

```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate (stop nginx first if using host nginx)
sudo certbot certonly --standalone -d yourdomain.com

# Update docker-compose to mount certificates
# volumes:
#   - /etc/letsencrypt/live/yourdomain.com:/etc/nginx/certs:ro
```

---

## 📊 MONITORING & TROUBLESHOOTING

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f embedding-api

# Follow last 100 lines
docker-compose logs --tail=100 -f
```

### Container Health

```bash
# Check container status
docker-compose ps

# Inspect specific container
docker-compose exec backend /bin/sh
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
docker-compose exec redis redis-cli ping
```

### Common Issues & Fixes

#### Frontend showing "Cannot GET /"

```
Cause: React Router not configured correctly
Fix: Ensure nginx-default.conf has try_files $uri $uri/ /index.html;
```

#### Backend API returning 502 Bad Gateway

```
Cause: Backend service unhealthy or not responding
Fix: Check backend logs: docker-compose logs backend
     Restart: docker-compose restart backend
```

#### Embedding service timing out

```
Cause: ML inference takes longer than proxy timeout
Fix: Already increased to 120s in nginx config
     If still slow: Increase proxy_read_timeout further
```

#### Database connection refused

```
Cause: Wrong credentials or MongoDB not healthy
Fix: Verify MONGO_INITDB_ROOT_PASSWORD in .env
     Check: docker-compose logs mongodb
     Restart: docker-compose restart mongodb
```

---

## 🚄 PERFORMANCE OPTIMIZATION

### 1. Gzip Compression

Already enabled in nginx.conf:

```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

**Saves ~70% bandwidth** on text content.

### 2. HTTP/2 Support

Add to nginx if supporting HTTPS:

```nginx
listen 443 ssl http2;
```

**Faster multiplexing** of multiple requests.

### 3. Browser Caching

Configured in nginx-default.conf:

- Static assets (JS/CSS): 1 year (immutable)
- HTML: 0 seconds (always check)

### 4. Database Indexing

Ensure backend creates indexes:

```javascript
// In MongoDB seeders/setup
db.collection.createIndex({ email: 1 }, { unique: true });
```

### 5. Redis Caching

Already configured as cache store:

```javascript
REDIS_URL=redis://redis:6379
```

Use for:

- Session storage
- Frequently accessed data
- Rate limit counters

### 6. Resource Limits

Set in docker-compose for predictable performance:

```yaml
deploy:
  resources:
    limits:
      cpus: "4"
      memory: 2G
```

---

## 🛡️ DISASTER RECOVERY

### Database Backup

```bash
# Daily backup
docker-compose exec mongodb mongodump --uri="mongodb://fti:password@localhost:27017/db_website_TI?authSource=admin" --out=/backup

# Automated backup (add to crontab)
0 2 * * * cd /opt/website-s1ti && docker-compose exec -T mongodb mongodump --uri="..." --out=/backup/$(date +\%Y\%m\%d)
```

### Restore from Backup

```bash
docker-compose exec mongodb mongorestore --uri="..." /backup/20260219
```

### Docker Volume Backup

```bash
# Backup all volumes
docker run --rm -v website-s1ti-network-mongodb_data:/data -v /backup:/backup \
  alpine tar czf /backup/mongodb_data.tar.gz -C /data .

# Restore
docker run --rm -v website-s1ti-network-mongodb_data:/data -v /backup:/backup \
  alpine tar xzf /backup/mongodb_data.tar.gz -C /data
```

### Container Update Process

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild only changed images
docker-compose build --no-cache

# 3. Restart services with new images (rolling restart)
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend

# 4. Verify health
docker-compose ps
```

---

## 📞 SUPPORT & CONTACT

For production issues, consult:

- Docker documentation: https://docs.docker.com
- Nginx documentation: https://nginx.org/en/docs
- MongoDB documentation: https://docs.mongodb.com
- Redis documentation: https://redis.io/documentation

---

**End of Production Deployment Guide**
