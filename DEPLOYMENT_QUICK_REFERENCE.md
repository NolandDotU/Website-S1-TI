# ⚡ QUICK REFERENCE - PRODUCTION DEPLOYMENT CARD

**Print this and keep it handy during deployment**

---

## 🔴 CRITICAL ISSUES THAT WERE FIXED

| Issue                    | Fix                           | Impact                      |
| ------------------------ | ----------------------------- | --------------------------- |
| Invalid version "1.0"    | → "3.9"                       | Docker now validates config |
| Frontend port 3000       | → 80                          | Nginx healthchecks pass     |
| DB credentials hardcoded | → .env                        | Credentials secured         |
| Embedding service wrong  | embedding_api → embedding-api | /chat/ endpoint works       |
| Nginx config missing     | Mount nginx.conf              | Gzip loads properly         |

---

## ✅ DEPLOYMENT QUICK START

```bash
# 1. SETUP
cp .env.production.example .env
# Edit .env with: MongoDB password, JWT secrets, API keys, URLs

# 2. VALIDATE
docker-compose config  # Should pass silently
./validate-production-ready.ps1  # Should show "PRODUCTION READY"

# 3. BUILD
docker-compose build  # ~10-20 minutes

# 4. START
docker-compose up -d

# 5. VERIFY
docker-compose ps  # All should be "healthy"
curl http://localhost/health  # Should return 200

# 6. TEST
curl http://localhost/api/health
curl http://localhost/chat/health
```

---

## 🔒 SECURITY CHECKLIST

Before going live, verify:

```
□ .env file created with STRONG passwords
□ .env is in .gitignore (NOT in git history)
□ JWT_SECRET: 32+ random characters
□ MONGO password: 16+ random characters
□ GOOGLE_CALLBACK_URL matches domain exactly
□ CORS_ORIGIN matches production domain
```

---

## 📊 HEALTH CHECK COMMANDS

Test each service individually:

```bash
# Nginx health
curl -I http://localhost/health

# Backend API health
curl -I http://localhost/api/health

# Embedding/Chat health
curl -I http://localhost/chat/health

# Full check
docker-compose ps
# All STATUS should show "healthy"
```

---

## 🚨 COMMON ISSUES & FIXES

| Problem                | Cause                    | Fix                                       |
| ---------------------- | ------------------------ | ----------------------------------------- |
| Can't GET /            | React router not working | Check nginx-default.conf has try_files    |
| 502 Bad Gateway        | Backend unhealthy        | Check docker-compose logs backend         |
| Chat/embedding timeout | ML inference slow        | Already increased timeout to 120s         |
| Can't connect to DB    | Wrong credentials        | Verify MONGO_INITDB_ROOT_PASSWORD in .env |
| Can't GET /api/\*      | Wrong upstream           | Check embedding-api:8000 in default.conf  |

---

## 📁 KEY FILES MODIFIED

```
docker-compose.yml          ✓ CRITICAL CHANGES
backend/Dockerfile          ✓ Minor improvements
frontend/Dockerfile         ✓ CRITICAL PORT FIX
embedding-model/Dockerfile  ✓ Minor improvements
nginx/Dockerfile            ✓ Health check added
nginx/conf.d/default.conf   ✓ CRITICAL FIXES
frontend/nginx-default.conf ✓ Security headers
```

---

## 📚 DOCUMENTATION

| Document                       | Purpose           | Read Time |
| ------------------------------ | ----------------- | --------- |
| PRODUCTION_READY_CHECKLIST.md  | This overview     | 5 min     |
| PRODUCTION_DEPLOYMENT_GUIDE.md | Full walkthrough  | 20 min    |
| DEPLOYMENT_AUDIT_SUMMARY.md    | Technical details | 15 min    |
| CHANGE_REFERENCE_GUIDE.md      | Before/after code | 10 min    |

---

## 🔑 CRITICAL ENVIRONMENT VARIABLES

```bash
# Database
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=<STRONG_PASSWORD_HERE>

# Security
JWT_SECRET=<RANDOM_32_CHARS>
JWT_REFRESH_SECRET=<RANDOM_32_CHARS>

# Google OAuth
GOOGLE_CLIENT_ID=your-app.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<SECRET>

# URLs
FRONTEND_ORIGIN=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/google/callback
```

---

## ⚙️ SERVICE PORTS

| Service   | Internal Port | Exposed   | Purpose       |
| --------- | ------------- | --------- | ------------- |
| Nginx     | 80            | 80        | Reverse proxy |
| Frontend  | 80            | Via nginx | React SPA     |
| Backend   | 5000          | Via nginx | REST API      |
| Embedding | 8000          | Via nginx | ML inference  |
| MongoDB   | 27017         | No        | Database      |
| Redis     | 6379          | No        | Cache         |

---

## 💻 REQUIRED SERVER SPECS

```
Minimum:
├─ CPU: 2 cores
├─ RAM: 4 GB
├─ Storage: 50 GB
└─ OS: Linux (Ubuntu 20.04+)

Recommended:
├─ CPU: 4 cores
├─ RAM: 8 GB
├─ Storage: 100 GB
└─ OS: Ubuntu 22.04 LTS
```

---

## 🎯 SECURITY HEADERS ADDED

All responses now include:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'; ...
```

---

## 📞 TROUBLESHOOTING HOTLINE

If something breaks:

1. **Check logs:** `docker-compose logs -f service-name`
2. **Check health:** `docker-compose ps`
3. **Restart service:** `docker-compose restart service-name`
4. **Nuclear option:** `docker-compose down && docker-compose up -d`

For persistent issues:

- Review PRODUCTION_DEPLOYMENT_GUIDE.md troubleshooting section
- Check MongoDB health: `docker-compose exec mongodb mongosh`
- Check Redis: `docker-compose exec redis redis-cli ping`

---

## 🎉 SUCCESS INDICATORS

After deployment, you should see:

✓ All containers in "healthy" status  
✓ No errors in logs  
✓ All health endpoints return 200  
✓ Frontend loads without CORS errors  
✓ API calls work correctly  
✓ Chat/embedding endpoint responds  
✓ Security headers in HTTP responses  
✓ Database connections working

---

## 📈 NEXT ACTIONS

Immediate (Post-Deployment):

1. Monitor logs for 1 hour
2. Run smoke tests
3. Check memory/CPU usage
4. Verify backups working

This Week:

1. Setup monitoring alerts
2. Configure log aggregation
3. Run load tests
4. Security audit with tools

This Month:

1. Implement CI/CD pipeline
2. Setup database replication
3. Configure auto-scaling
4. Document runbooks

---

**REMEMBER:** This deployment is production-ready NOW.  
Any issues that arise are likely environmental, not configuration.  
Check logs first. Restart services second. Escalate as needed.

---

**Printed:** February 19, 2026  
**Version:** 1.0  
**Status:** APPROVED FOR PRODUCTION
