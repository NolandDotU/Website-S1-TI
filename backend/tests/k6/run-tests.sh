#!/bin/bash

# K6 Test Runner Script
# Runs various K6 tests with different configurations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
BASE_URL="http://localhost:5000/api/v1"
TEST_TYPE="smoke"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --base-url)
      BASE_URL="$2"
      shift 2
      ;;
    --test)
      TEST_TYPE="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: ./run-tests.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --base-url URL    Set API base URL (default: http://localhost:5000/api/v1)"
      echo "  --test TYPE       Test type: smoke, load, spike, stress, endurance, api, auth, all"
      echo "  -h, --help        Show this help message"
      echo ""
      echo "Examples:"
      echo "  ./run-tests.sh --test smoke"
      echo "  ./run-tests.sh --base-url https://api.example.com --test load"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   K6 Load Testing Suite                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Base URL: ${GREEN}${BASE_URL}${NC}"
echo -e "Test Type: ${GREEN}${TEST_TYPE}${NC}"
echo ""

# Function to run a test
run_test() {
  local test_name=$1
  local test_file=$2
  
  echo -e "${YELLOW}Running ${test_name}...${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  k6 run \
    --vus 10 \
    --duration 30s \
    -e BASE_URL="${BASE_URL}" \
    "tests/k6/${test_file}"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ${test_name} completed${NC}"
  else
    echo -e "${RED}✗ ${test_name} failed${NC}"
  fi
  echo ""
}

# Run tests based on type
case $TEST_TYPE in
  smoke)
    run_test "Smoke Test" "smoke-test.js"
    ;;
  load)
    run_test "Load Test" "load-test.js"
    ;;
  spike)
    run_test "Spike Test" "spike-test.js"
    ;;
  stress)
    run_test "Stress Test" "stress-test.js"
    ;;
  endurance)
    run_test "Endurance Test" "endurance-test.js"
    ;;
  api)
    run_test "API Routes Test" "api-routes-test.js"
    ;;
  auth)
    run_test "Authentication Test" "auth-test.js"
    ;;
  all)
    run_test "Smoke Test" "smoke-test.js"
    run_test "API Routes Test" "api-routes-test.js"
    run_test "Authentication Test" "auth-test.js"
    run_test "Load Test" "load-test.js"
    run_test "Spike Test" "spike-test.js"
    ;;
  *)
    echo -e "${RED}Unknown test type: ${TEST_TYPE}${NC}"
    echo "Available types: smoke, load, spike, stress, endurance, api, auth, all"
    exit 1
    ;;
esac

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Testing Complete                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
