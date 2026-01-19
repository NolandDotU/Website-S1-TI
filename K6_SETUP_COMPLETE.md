# ✅ K6 Load Testing Suite - Implementation Complete

## 📦 What Was Created

I've created a **complete K6 load testing suite** for your Website-S1-TI backend with **8 test scripts**, **helper utilities**, and **comprehensive documentation**.

### 📁 File Structure

```
backend/tests/k6/
├── 📄 Core Configuration
│   ├── config.js                 # Configuration, mock data, constants
│   └── helpers.js                # Reusable utility functions
│
├── 🧪 Test Scripts (8 files)
│   ├── smoke-test.js             # ⚡ Health check (1s, 1 VU)
│   ├── api-routes-test.js        # 📡 Full API coverage (25s, 10 VUs)
│   ├── auth-test.js              # 🔐 Authentication flows (20s, 5 VUs)
│   ├── load-test.js              # 📈 Progressive load (50s, 5→20 VUs)
│   ├── spike-test.js             # 📊 Traffic spike (20s, 10→100 VUs)
│   ├── stress-test.js            # 💥 Breaking point (45s, 50→200 VUs)
│   ├── endurance-test.js         # ⏱️  Long-running (14m, 10 VUs)
│   └── setup-teardown-test.js    # 🔄 Lifecycle demo
│
├── 🚀 Runner Scripts
│   ├── quick-start.sh            # Interactive quick start (Linux/Mac)
│   ├── quick-start.bat           # Interactive quick start (Windows)
│   ├── run-tests.sh              # Full test runner (Linux/Mac)
│   └── run-tests.bat             # Full test runner (Windows)
│
└── 📖 Documentation
    ├── README.md                 # Complete documentation
    └── (this file above: K6_TESTING_GUIDE.md)
```

## 🎯 Test Coverage

### ✅ Endpoints Tested

**Lecturers Module**

- `GET /lecturers` - List with pagination/filter
- `GET /lecturers/:id` - Get single lecturer
- `POST /lecturers/uploads` - Image upload

**Announcements Module**

- `GET /announcements` - List with category filter
- `GET /announcements/:id` - Get single announcement
- `POST /announcements/uploads` - Image upload

**Highlights Module**

- `GET /highlight` - List highlights
- `GET /highlight?featured=true` - Featured only

**Dashboard Module**

- `GET /dashboard` - Dashboard data
- `GET /dashboard/statistics` - Stats

**History Module**

- `GET /history` - User history
- `GET /history?page=1&limit=20` - With pagination

**Chat/RAG Module**

- `POST /chat/query` - Chat queries

**Authentication**

- `POST /auth/login` - User login
- `POST /auth/register` - Registration
- `POST /auth/logout` - Logout
- `GET /auth/me` - Current user
- `GET /auth/google` - Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/admin` - Admin check

## 🚀 Quick Start (3 steps)

### 1️⃣ Install K6

```bash
# Windows
choco install k6

# macOS
brew install k6

# Linux
sudo apt-get install k6
```

### 2️⃣ Start Your Backend

```bash
cd backend
npm install
npm run dev
# Server running on http://localhost:5000
```

### 3️⃣ Run Tests

**Windows Users:**

```bash
# Interactive mode
tests\k6\quick-start.bat

# Or specific test
tests\k6\run-tests.bat --test smoke
```

**macOS/Linux Users:**

```bash
# Make executable
chmod +x tests/k6/quick-start.sh

# Interactive mode
./tests/k6/quick-start.sh

# Or specific test
./tests/k6/run-tests.sh --test smoke
```

## 🧪 Test Descriptions

| Test               | Duration | VUs    | What It Tests                        |
| ------------------ | -------- | ------ | ------------------------------------ |
| **Smoke**          | 1s       | 1      | Quick health check of all endpoints  |
| **API Routes**     | 25s      | 10     | Comprehensive endpoint coverage      |
| **Auth**           | 20s      | 5      | Login, JWT tokens, protected routes  |
| **Load**           | 50s      | 5→20   | Gradual increase in concurrent users |
| **Spike**          | 20s      | 10→100 | Sudden traffic spike (100 VUs in 5s) |
| **Stress**         | 45s      | 50→200 | Push to breaking point (200 VUs)     |
| **Endurance**      | 14m      | 10     | Stability over time (14 minutes)     |
| **Setup/Teardown** | -        | -      | Demo proper test lifecycle           |

## 💡 Usage Examples

### Basic Commands

```bash
# Run smoke test (simplest)
k6 run tests/k6/smoke-test.js

# Run with custom URL
k6 run -e BASE_URL=https://api.example.com tests/k6/api-routes-test.js

# Run with custom load
k6 run --vus 100 --duration 5m tests/k6/load-test.js

# Export results as JSON
k6 run --out json=results.json tests/k6/load-test.js
```

### Using Runner Scripts

```bash
# Windows - with options
run-tests.bat --test load --base-url http://api.example.com

# macOS/Linux - with options
./run-tests.sh --test spike --base-url https://api.example.com

# Run all tests
run-tests.bat --test all
./run-tests.sh --test all
```

## 🔧 Configuration

### Update Admin Credentials

Edit `backend/tests/k6/config.js`:

```javascript
admin: {
  email: 'your-admin@example.com',
  password: 'your-password',
}
```

### Update Mock Data

Edit the `mockData` object in `config.js` to match your application's data format.

### Adjust Load Parameters

Edit `stages` in individual test files:

```javascript
export const options = {
  stages: [
    { duration: "5s", target: 10 }, // Ramp-up
    { duration: "10s", target: 10 }, // Hold
    { duration: "5s", target: 0 }, // Ramp-down
  ],
};
```

## 📊 Understanding Results

### Example Output

```
checks.........................: 98% ✓ 196 ✗ 4
http_req_duration..............: avg=145ms p(95)=289ms p(99)=456ms ✓
http_req_failed................: 2% ✓
http_reqs......................: 200 ✓
iterations.....................: 10
vus_max........................: 10
```

**Green ✓** = Passed thresholds
**Red ✗** = Failed thresholds

## 🐛 Troubleshooting

**Backend not running?**

```bash
curl http://localhost:5000/health
# Should return: {"status":"OK"}
```

**Authentication fails?**

- Update credentials in `config.js`
- Verify user exists in database
- Check JWT_SECRET matches

**High failure rate?**

- Reduce load: `k6 run --vus 5 tests/k6/load-test.js`
- Check backend logs
- Verify database connectivity

## 📚 Helper Functions Available

All tests can use these reusable helpers from `helpers.js`:

- `makeGetRequest(url)` - GET with error handling
- `makePostRequest(url, payload)` - POST with error handling
- `makeAuthenticatedRequest(method, url, token, payload)` - Authenticated requests
- `authenticateUser(url, email, password)` - Login and get token
- `checkStandardResponse(response, expectedStatus)` - Validate response format
- `extractFromResponse(response, path)` - Parse response JSON
- `generateRandomString(length)` - Generate test data
- `testGroup(name, fn)` - Group related tests

## 🎯 Best Practices

✅ **Always run smoke test first** - Quick validation
✅ **Test locally before production** - Catch issues early  
✅ **Gradually increase load** - Use ramp-up stages
✅ **Monitor resources** - CPU, memory, disk during tests
✅ **Test off-peak hours** - Avoid impacting real users
✅ **Save results** - Generate JSON for analysis
✅ **Review logs** - Check backend logs during tests

## 🔗 Next Steps

1. **Configure credentials** - Update `config.js` with your admin account
2. **Run smoke test** - Verify endpoints are working
3. **Run API routes test** - Check endpoint coverage
4. **Adjust load tests** - Modify for your expected traffic
5. **Integrate with CI/CD** - Add to GitHub Actions/GitLab CI

## 📖 Full Documentation

See `backend/tests/k6/README.md` for:

- Installation instructions
- Detailed test descriptions
- Advanced K6 features
- CI/CD integration examples
- Troubleshooting guide

See `K6_TESTING_GUIDE.md` in project root for overview.

## ✨ Key Features

✅ **8 Different Test Types** - Smoke, load, spike, stress, endurance, API, auth, setup/teardown
✅ **Reusable Helpers** - DRY principle for test code
✅ **Mock Data** - Predefined test data in config
✅ **Error Handling** - Graceful error handling in all requests
✅ **Flexible Configuration** - Easy to customize
✅ **Cross-Platform** - Works on Windows, macOS, Linux
✅ **CI/CD Ready** - Can be integrated into pipelines
✅ **Comprehensive Documentation** - README + guides

## 🎉 You're Ready!

Your K6 testing suite is complete and ready to use. Start with:

```bash
# Windows
tests\k6\quick-start.bat

# macOS/Linux
./tests/k6/quick-start.sh
```

Happy Load Testing! 🚀
