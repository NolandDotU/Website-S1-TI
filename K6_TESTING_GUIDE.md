# K6 Testing Suite - Complete Summary

## 📦 What's Included

I've created a comprehensive K6 load testing suite for your Website-S1-TI backend. Here's what was set up:

### Core Files

```
backend/tests/k6/
├── config.js                    # Configuration & mock data
├── helpers.js                   # Reusable utility functions
├── README.md                    # Complete documentation
├── quick-start.sh/bat          # Quick start guide
├── run-tests.sh/bat            # Test runner script
│
└── Test Scripts:
    ├── smoke-test.js           # Quick health check (1 VU)
    ├── api-routes-test.js      # Endpoint coverage (10 VUs)
    ├── auth-test.js            # Authentication flows (5 VUs)
    ├── load-test.js            # Progressive load (5→20 VUs)
    ├── spike-test.js           # Traffic spike (10→100 VUs)
    ├── stress-test.js          # Stress test (50→200 VUs)
    ├── endurance-test.js       # 14-minute stability test
    └── setup-teardown-test.js  # Lifecycle demonstration
```

## 🚀 Quick Start

### 1. Install K6

```bash
# Windows (with Chocolatey)
choco install k6

# macOS
brew install k6

# Linux
sudo apt-get install k6

# Verify
k6 version
```

### 2. Ensure Backend is Running

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should show: Server running on http://localhost:5000
```

### 3. Run Tests

**Windows:**

```bash
# Quick start (interactive)
tests\k6\quick-start.bat

# Or run specific test
tests\k6\run-tests.bat --test smoke
```

**macOS/Linux:**

```bash
# Make executable
chmod +x tests/k6/quick-start.sh
chmod +x tests/k6/run-tests.sh

# Quick start (interactive)
./tests/k6/quick-start.sh

# Or run specific test
./tests/k6/run-tests.sh --test smoke
```

**Direct K6 Command:**

```bash
k6 run tests/k6/smoke-test.js
k6 run -e BASE_URL=https://api.example.com tests/k6/load-test.js
```

## 📊 Test Types

| Test           | Duration | VUs    | Purpose              |
| -------------- | -------- | ------ | -------------------- |
| **Smoke**      | ~1s      | 1      | Quick health check   |
| **API Routes** | ~25s     | 10     | Endpoint coverage    |
| **Auth**       | ~20s     | 5      | Authentication flows |
| **Load**       | ~50s     | 5→20   | Progressive load     |
| **Spike**      | ~20s     | 10→100 | Traffic spike        |
| **Stress**     | ~45s     | 50→200 | Breaking point       |
| **Endurance**  | ~14m     | 10     | Stability over time  |

## 🧪 Endpoints Tested

### Public Endpoints (No Auth)

- ✅ `GET /health` - Health check
- ✅ `GET /lecturers` - Get all lecturers
- ✅ `GET /lecturers/:id` - Get lecturer details
- ✅ `GET /announcements` - Get announcements
- ✅ `GET /announcements/:id` - Get announcement details
- ✅ `GET /highlight` - Get highlights
- ✅ `GET /chat/health` - Chat health

### Protected Endpoints (Requires Auth)

- ✅ `GET /auth/me` - Current user info
- ✅ `GET /auth/admin` - Admin check
- ✅ `GET /dashboard` - Dashboard (admin)
- ✅ `GET /dashboard/statistics` - Statistics
- ✅ `GET /history` - User history
- ✅ `GET /user/profile` - User profile

### Authentication Endpoints

- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/register` - Registration
- ✅ `POST /auth/logout` - Logout
- ✅ `GET /auth/google` - Google OAuth
- ✅ `GET /auth/google/callback` - OAuth callback

## 📈 Key Metrics Tracked

- **Response Time (http_req_duration)** - How fast endpoints respond
- **Failure Rate (http_req_failed)** - Percentage of failed requests
- **Request Count (http_reqs)** - Total requests sent
- **Virtual Users (vus)** - Concurrent connections
- **Throughput** - Requests per second

## ⚙️ Configuration

### Update Admin Credentials

Edit `tests/k6/config.js`:

```javascript
admin: {
  email: 'your-admin@example.com',
  password: 'your-password',
},
```

### Update Mock Data

Edit `tests/k6/config.js` to customize test data for your application.

### Adjust Load Stages

Modify `stages` in individual test files to change VU ramp-up/down.

## 🔍 Running Tests with Options

```bash
# With custom base URL
k6 run -e BASE_URL=https://api.example.com tests/k6/smoke-test.js

# Generate JSON report
k6 run --out json=results.json tests/k6/load-test.js

# Set VUs and duration
k6 run --vus 50 --duration 2m tests/k6/load-test.js

# With custom timeout
k6 run --http-debug=full tests/k6/smoke-test.js
```

## 📊 Understanding Results

### Passing Test Example

```
checks.........................: 98.5% ✓ 197 ✗ 3
data_received..................: 245 kB
data_sent.......................: 124 kB
http_req_blocked...............: avg=1.2ms
http_req_connecting............: avg=0.8ms
http_req_duration..............: avg=145.3ms p(95)=289.5ms p(99)=456.2ms ✓
http_req_failed................: 1.5% ✓
http_req_receiving.............: avg=32.1ms
http_req_sending...............: avg=18.5ms
http_req_tls_handshaking.......: avg=0ms
http_req_waiting...............: avg=94.7ms
http_reqs......................: 200 OK
iterations......................: 10
vus............................: 0
vus_max.........................: 10
```

### Key Metrics

- **checks** - Custom assertions (should be >95%)
- **http_req_duration** - Response time (lower is better)
- **http_req_failed** - Failure rate (should be <5%)
- **vus_max** - Peak concurrent users

## 🐛 Troubleshooting

### "Failed to connect to localhost:5000"

```bash
# Check backend is running
curl http://localhost:5000/health

# Verify from different terminal
# Start backend: npm run dev in backend folder
```

### "Authentication failed in tests"

```bash
# Update credentials in config.js
# Verify user exists in database
# Check JWT_SECRET matches
```

### High failure rate

```bash
# Reduce load
k6 run --vus 5 tests/k6/load-test.js

# Check backend logs for errors
# Monitor database connectivity
# Verify Redis is running (if used)
```

## 🎯 Best Practices

1. ✅ **Always run smoke test first** - Verify endpoints work
2. ✅ **Test locally before production** - Identify issues early
3. ✅ **Gradually increase load** - Don't overwhelm the system
4. ✅ **Monitor system resources** - CPU, memory, disk usage
5. ✅ **Test during maintenance windows** - Don't affect real users
6. ✅ **Review logs** - Check backend logs during tests
7. ✅ **Save results** - Generate reports for analysis

## 📝 Sample Commands

```bash
# Quick smoke test
k6 run tests/k6/smoke-test.js

# Load test with 50 VUs for 5 minutes
k6 run --vus 50 --duration 5m tests/k6/load-test.js

# Run all tests and save results
for test in smoke load spike stress; do
  k6 run --out json=results-$test.json tests/k6/$test-test.js
done

# Test against production (use with caution!)
k6 run -e BASE_URL=https://api.production.com tests/k6/smoke-test.js
```

## 🔗 Useful Links

- [K6 Documentation](https://k6.io/docs)
- [K6 API Reference](https://k6.io/docs/javascript-api)
- [HTTP Request](https://k6.io/docs/javascript-api/k6-http)
- [Checks & Thresholds](https://k6.io/docs/using-k6/checks)
- [K6 Cloud (Free Tier)](https://cloud.k6.io)

## 📞 Need Help?

1. Check `README.md` in tests/k6 folder
2. Review K6 documentation
3. Verify backend is running
4. Check admin credentials
5. Monitor backend logs

---

**Happy Load Testing! 🚀**

For updates or new tests, follow the patterns in existing test files and use the helper functions from `helpers.js`.
