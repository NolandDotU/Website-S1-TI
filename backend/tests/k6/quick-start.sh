#!/bin/bash
# Quick start script for K6 testing

echo "🚀 K6 Load Testing - Quick Start Guide"
echo "======================================"
echo ""

# Check if K6 is installed
if ! command -v k6 &> /dev/null; then
  echo "❌ K6 is not installed. Installing..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install k6
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo apt-get install k6
  else
    echo "Please install K6 from https://k6.io/docs/getting-started/installation"
    exit 1
  fi
else
  echo "✅ K6 is installed: $(k6 version)"
fi

echo ""
echo "📋 Available Tests:"
echo "1. Smoke Test (quick health check)"
echo "2. API Routes Test (endpoint coverage)"
echo "3. Authentication Test (auth flows)"
echo "4. Load Test (progressive increase)"
echo "5. Spike Test (sudden traffic)"
echo "6. Stress Test (breaking point)"
echo "7. Endurance Test (long-running)"
echo ""

read -p "Select test (1-7) or press Enter for smoke test [1]: " choice
choice=${choice:-1}

BASE_URL="http://localhost:5000/api/v1"
read -p "Enter API base URL (default: $BASE_URL): " custom_url
BASE_URL=${custom_url:-$BASE_URL}

echo ""
echo "📊 Running test..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

case $choice in
  1)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/smoke-test.js
    ;;
  2)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/api-routes-test.js
    ;;
  3)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/auth-test.js
    ;;
  4)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/load-test.js
    ;;
  5)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/spike-test.js
    ;;
  6)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/stress-test.js
    ;;
  7)
    k6 run -e BASE_URL="$BASE_URL" tests/k6/endurance-test.js
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Test completed!"
echo ""
echo "💡 Next steps:"
echo "  - Run setup-teardown-test.js for authentication tests"
echo "  - Review K6 results in real-time at https://cloud.k6.io"
echo "  - Export results: k6 run --out json=results.json <test>.js"
echo ""
