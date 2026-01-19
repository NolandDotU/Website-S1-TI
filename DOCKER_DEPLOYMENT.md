# Docker Deployment Guide

## Quick Start

### 1. Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Upstash account (free tier available at https://upstash.com/)

### 2. Cloud Services Setup

#### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and new cluster
3. Create a database user with credentials
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/website_s1ti`)
5. Whitelist your IP address (or allow all with `0.0.0.0/0` for dev)

#### Upstash Redis Setup

1. Go to https://console.upstash.com/
2. Create a new Redis database (free tier available)
3. Copy your Redis URL (looks like: `redis://default:password@host.upstash.io:port`)

### 3. Environment Setup

```bash
# Copy the example env file and update with your cloud service credentials
cp .env.example .env

# Edit .env with your actual configuration
# Critical variables:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - REDIS_URL: Your Upstash Redis URL
# - JWT_SECRET and JWT_REFRESH_SECRET: Generate strong random secrets
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET: (if using Google OAuth)
```

### 4. Build and Start Services

```bash
# Build images and start all services (only Backend and Frontend now)
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Access the Application

- **Frontend**: http://localhost (or http://localhost:80)
- **Backend API**: http://localhost:5000 (or http://localhost:5000/api)
- **API Documentation**: http://localhost:5000/api/docs (if Swagger is configured)
- **MongoDB**: Managed via MongoDB Atlas console
- **Redis**: Managed via Upstash console

### 6. Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Check service status
docker-compose ps

# Execute command in a container
docker-compose exec backend npm run lint
docker-compose exec frontend npm run build

# View resource usage
docker stats

# View backend logs
docker-compose logs -f backend
```

## Architecture

### Services

**Backend** (`backend`)

- Node.js Express API
- Port: 5000
- Built from `./backend/Dockerfile`
- Connects to cloud MongoDB and Upstash Redis
- Volumes: uploads, logs

**Frontend** (`frontend`)

- React SPA with Nginx
- Port: 80
- Built from `./frontend/Dockerfile`
- Nginx handles:
  - React Router (SPA routing)
  - API proxy to backend
  - Static asset caching
  - Security headers

### Networking

Services communicate via `website-network` bridge network:

- Frontend → Backend: `http://backend:5000`
- Backend → MongoDB Atlas: via MONGODB_URI connection string
- Backend → Upstash Redis: via REDIS_URL connection string

All cloud service connections are made through secure, encrypted connections managed by each provider.

## Production Deployment

### Security Best Practices

1. **Environment Variables**

   ```bash
   # Generate strong secrets
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_REFRESH_SECRET=$(openssl rand -base64 32)
   ```

2. **Cloud Service Security**
   - **MongoDB Atlas**:
     - Use IP whitelist (whitelist only your deployment servers)
     - Enable authentication with strong passwords
     - Use VPC peering for production (paid tier)
   - **Upstash Redis**:
     - Use EVICTION policy appropriate for your use case
     - Monitor via Upstash console
     - Consider clustering for production traffic

3. **Update Ports in Production**
   Change ports in `.env`:

   ```
   FRONTEND_PORT=443  # If using SSL
   BACKEND_PORT=5000
   ```

4. **Use Reverse Proxy (Recommended)**
   - Deploy Nginx or Traefik in front for SSL/TLS termination
   - Load balancing
   - Rate limiting

5. **Logging & Monitoring**
   - Monitor logs: `docker-compose logs --follow`
   - Use Docker logging drivers for centralized logging
   - Backend writes to `/app/logs` directory
   - Set up monitoring for MongoDB Atlas and Upstash via their consoles

6. **Backup Strategy**
   - **MongoDB**: Use MongoDB Atlas automated backups (available in paid plans) or manual snapshots
   - **Redis**: Configure Upstash persistence and backups via their console

### Scaling

For production, consider:

- Kubernetes for orchestration
- Docker Swarm for simpler deployments
- Load balancing with multiple backend instances
- Upstash supports clustering for high traffic
- MongoDB Atlas supports sharding for large datasets

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Verify .env variables are set
cat .env | grep MONGODB_URI
cat .env | grep REDIS_URL

# Rebuild without cache
docker-compose build --no-cache backend
docker-compose up -d
```

### Connection issues

```bash
# Test MongoDB connection from backend
docker-compose exec backend node -e "
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connected!');
    process.exit(0);
  }).catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
"

# Test Redis connection from backend
docker-compose exec backend node -e "
  const redis = require('redis');
  const client = redis.createClient({ url: process.env.REDIS_URL });
  client.connect().then(() => {
    console.log('Redis connected!');
    process.exit(0);
  }).catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
"

# Check network
docker network inspect website-network
```

### MongoDB connection fails

- Verify connection string format: `mongodb+srv://username:password@host/database`
- Check IP whitelist in MongoDB Atlas console
- Ensure credentials are correct
- Try connecting from MongoDB Compass to test

### Redis connection fails

- Verify Upstash Redis URL format: `redis://default:password@host:port`
- Check Upstash console for Redis status
- Ensure database is running (free tier may have rate limits)
- Verify credentials are correct

### Port conflicts

Update ports in `.env` or free up ports:

```bash
# Find what's using a port (e.g., 80)
netstat -ano | findstr :80  # Windows
lsof -i :80                  # Mac/Linux
```

## Files Created

```
project/
├── docker-compose.yml            # Orchestration file (Backend + Frontend only)
├── .env.example                  # Environment template with cloud service URLs
├── .env                          # Your configuration (create from .env.example)
├── backend/
│   ├── Dockerfile                # Multi-stage Node.js/TypeScript build
│   └── .dockerignore             # Build context optimization
├── frontend/
│   ├── Dockerfile                # Multi-stage React + Nginx build
│   ├── nginx.conf                # Nginx configuration
│   ├── nginx-default.conf        # Nginx server block
│   └── .dockerignore             # Build context optimization
└── DOCKER_DEPLOYMENT.md          # This file
```

## Environment Variables Reference

### Required Variables

- **MONGODB_URI**: MongoDB Atlas connection string
- **REDIS_URL**: Upstash Redis connection URL

### Recommended Variables

- **JWT_SECRET**: Secret key for JWT tokens (min 32 chars)
- **JWT_REFRESH_SECRET**: Secret for refresh tokens (min 32 chars)
- **GOOGLE_CLIENT_ID**: For Google OAuth (optional)
- **GOOGLE_CLIENT_SECRET**: For Google OAuth (optional)

### Optional Variables

- **NODE_ENV**: Set to `production` for production deployments
- **LOG_LEVEL**: Set log verbosity (debug, info, warn, error)
- **FRONTEND_PORT**: Frontend port (default: 80)
- **BACKEND_PORT**: Backend port (default: 5000)

## Getting Cloud Service URLs

### MongoDB Atlas

1. Log in to https://account.mongodb.com/account/login
2. Go to Clusters → Connect → Drivers
3. Copy the connection string
4. Replace `<username>` and `<password>` with your database user credentials
5. Set as `MONGODB_URI` in `.env`

Example:

```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/website_s1ti?retryWrites=true&w=majority
```

### Upstash Redis

1. Log in to https://console.upstash.com/
2. Create or select your Redis database
3. Copy the Redis URL from the "REST API" or "Node" tab
4. It will look like: `redis://default:password@host.upstash.io:port`
5. Set as `REDIS_URL` in `.env`

## Notes

- Only Backend and Frontend containers run locally
- MongoDB and Redis are managed by their cloud providers
- No local data volumes needed
- Scaling is managed by cloud providers' built-in tools
- All connections use secure, encrypted protocols
- Cloud services handle backups and maintenance

## Support

For issues:

1. Check logs: `docker-compose logs`
2. Verify .env file has correct MongoDB URI and Redis URL
3. Test cloud service credentials in their respective consoles
4. Ensure Docker daemon is running
5. Check internet connectivity to cloud services
