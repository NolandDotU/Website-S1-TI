# K6 Load Testing Suite for Website-S1-TI Backend

This folder contains comprehensive load testing scripts using **K6**, a modern load testing tool.

## 📋 Test Files

### Core Configuration

- **`config.js`** - Central configuration, mock data, and constants
- **`helpers.js`** - Reusable utility functions for all tests

### Test Scripts

1. **`smoke-test.js`** - Quick health check for all endpoints
   - Tests: Health check, all major endpoints
   - Duration: ~1 second
   - VUs: 1

2. **`api-routes-test.js`** - Comprehensive API endpoint testing
   - Tests: All GET/POST endpoints with pagination and filters
   - Tests lecturers, announcements, highlights, dashboard, chat
   - Duration: ~25 seconds
   - VUs: 10

3. **`auth-test.js`** - Authentication and protected routes testing
   - Tests: Login, registration, JWT tokens, admin endpoints
   - Tests: Google OAuth endpoints
   - Duration: ~20 seconds
   - VUs: 5

4. **`load-test.js`** - Progressive load testing
   - Gradually increases from 5 to 20 concurrent users
   - Tests read operations under increasing load
   - Duration: ~50 seconds

5. **`spike-test.js`** - Sudden traffic spike testing
   - Simulates sudden traffic increases (100 VUs in 5s)
   - Tests system resilience
   - Duration: ~20 seconds

6. **`stress-test.js`** - Push system to breaking point
   - Increases to 200 concurrent users
   - Allows 20% failure rate during stress
   - Duration: ~45 seconds

7. **`endurance-test.js`** - Long-running stability test
   - Maintains 10 VUs for 10 minutes
   - Detects memory leaks and degradation
   - Duration: ~14 minutes

8. **`setup-teardown-test.js`** - Setup/teardown with authentication
   - Demonstrates proper test lifecycle
   - Authenticates and cleans up resources

## 🚀 Installation

### Prerequisites

1. **Install K6**
   - Windows: `choco install k6`
   - macOS: `brew install k6`
   - Linux: `sudo apt-get install k6`

   Or download from: https://k6.io/docs/getting-started/installation

2. **Verify Installation**
   ```bash
   k6 version
   ```

## 🧪 Running Tests

### Basic Usage

```bash
# Run smoke test
k6 run tests/k6/smoke-test.js

# Run with custom base URL
k6 run -e BASE_URL=https://api.example.com tests/k6/api-routes-test.js

# Run with custom VUs and duration
k6 run --vus 50 --duration 2m tests/k6/load-test.js
```

### Using Test Runner Scripts

**Windows:**

```bash
# Run smoke test
run-tests.bat --test smoke

# Run load test with custom URL
run-tests.bat --base-url http://api.example.com --test load

# Run all tests
run-tests.bat --test all
```

**macOS/Linux:**

```bash
# Make executable
chmod +x run-tests.sh

# Run smoke test
./run-tests.sh --test smoke

# Run load test with custom URL
./run-tests.sh --base-url http://api.example.com --test load

# Run all tests
./run-tests.sh --test all
```

## 📊 Test Scenarios

### Test Type Recommendations

| Test           | Purpose                        | When to Use             |
| -------------- | ------------------------------ | ----------------------- |
| **Smoke**      | Verify endpoints work          | Before every deployment |
| **API Routes** | Comprehensive endpoint testing | During development      |
| **Auth**       | Verify authentication flows    | Before auth changes     |
| **Load**       | Progressive load increase      | Capacity planning       |
| **Spike**      | Sudden traffic increase        | Black Friday/events     |
| **Stress**     | Breaking point identification  | Failure analysis        |
| **Endurance**  | Long-term stability            | Before production       |

## 🔧 Configuration

### Environment Variables

```bash
# Custom base URL
k6 run -e BASE_URL=http://localhost:5000/api/v1 smoke-test.js

# Custom frontend URL
k6 run -e FRONTEND_URL=http://localhost:3000 smoke-test.js
```

### Adjusting Test Parameters

Edit `config.js` to modify:

- `stages` - VU ramp-up/down schedule
- `thresholds` - Pass/fail criteria
- `mockData` - Test data
- Admin credentials for authenticated tests

### Mock Data

Update credentials in `config.js`:

```javascript
admin: {
  email: 'your-admin@example.com',
  password: 'your-password',
},
```

## 📈 Understanding Results

### Key Metrics

- **http_req_duration** - Response time in milliseconds
- **http_req_failed** - Failed request rate
- **http_reqs** - Total requests completed
- **vus** - Virtual users (concurrent connections)
- **vus_max** - Maximum VUs during test

### Thresholds

Tests pass if metrics meet defined thresholds:

```
'http_req_duration{endpoint:/lecturers}': ['p(95)<300']  // 95% of requests < 300ms
'http_req_failed': ['rate<0.1']                           // Less than 10% failures
```

## 🐛 Troubleshooting

### Authentication Issues

1. Verify admin credentials in `config.js`
2. Ensure MongoDB and backend are running
3. Check user exists in database

### Connection Errors

1. Verify backend is running: `curl http://localhost:5000/health`
2. Check firewall rules
3. Verify `BASE_URL` is correct

### High Failure Rates

1. Check backend logs
2. Verify database connectivity
3. Increase timeouts in `config.js`
4. Reduce load (decrease `target` in stages)

## 📝 Best Practices

1. **Always run smoke test first** - Verify endpoints are working
2. **Test locally before production** - Identify issues early
3. **Gradually increase load** - Use ramp-up stages
4. **Monitor system resources** - Watch CPU, memory, disk
5. **Test during low-traffic times** - Don't affect users
6. **Save results** - Generate JSON reports for analysis

## 🔍 Advanced Usage

### Generate JSON Report

```bash
k6 run --out json=results.json tests/k6/load-test.js
```

### Run Multiple Tests in Sequence

```bash
k6 run tests/k6/smoke-test.js && \
k6 run tests/k6/api-routes-test.js && \
k6 run tests/k6/load-test.js
```

### Custom Thresholds

```bash
k6 run --rps 100 tests/k6/load-test.js  # Limit requests per second
```

## 📚 Resources

- [K6 Documentation](https://k6.io/docs)
- [K6 API Reference](https://k6.io/docs/javascript-api)
- [Best Practices](https://k6.io/docs/testing-guides/load-testing-best-practices)
- [Examples](https://github.com/grafana/k6/tree/master/samples)

## 🤝 Contributing

To add new tests:

1. Create new file in `tests/k6/` folder
2. Import helpers from `helpers.js`
3. Follow naming convention: `*-test.js`
4. Document in this README

## ⚙️ Integration with CI/CD

Add to your GitHub Actions / GitLab CI:

```yaml
name: Load Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run K6 Smoke Test
        run: k6 run tests/k6/smoke-test.js
```

## 📞 Support

For issues or questions:

1. Check K6 documentation
2. Review test logs and output
3. Verify backend is running correctly
4. Check admin credentials and database
