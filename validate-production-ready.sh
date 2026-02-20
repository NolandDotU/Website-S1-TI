#!/bin/bash

# ============================================
# PRODUCTION READINESS VALIDATION SCRIPT
# ============================================
# This script validates that all configuration changes have been properly applied
# and the system is ready for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================${NC}\n"
}

print_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# ============================================
# VALIDATION TESTS
# ============================================

print_header "VALIDATING DOCKER COMPOSE CONFIGURATION"

# Test 1: Valid docker-compose version
if grep -q 'version: "3.9"' docker-compose.yml; then
    print_pass "Docker Compose version is 3.9"
else
    print_fail "Docker Compose version is not 3.9"
fi

# Test 2: No hardcoded MongoDB password
if grep -q 'MONGO_INITDB_ROOT_PASSWORD: .*ftiuksw' docker-compose.yml; then
    print_fail "MongoDB password still hardcoded (ftiuksw)"
else
    print_pass "MongoDB password uses environment variable"
fi

# Test 3: Frontend exposes port 80
if grep -A2 'frontend:' docker-compose.yml | grep -q 'expose:' && \
   grep -A3 'frontend:' docker-compose.yml | grep -q '- "80"'; then
    print_pass "Frontend container exposes port 80"
else
    print_fail "Frontend container does not expose port 80"
fi

# Test 4: Nginx config volumes include main nginx.conf
if grep -q './nginx/nginx.conf:/etc/nginx/nginx.conf:ro' docker-compose.yml; then
    print_pass "Nginx main config (nginx.conf) is mounted"
else
    print_fail "Nginx main config (nginx.conf) is NOT mounted"
fi

# Test 5: Nginx has health check
if grep -A10 '  nginx:' docker-compose.yml | grep -q 'healthcheck:'; then
    print_pass "Nginx has health check configured"
else
    print_fail "Nginx does not have health check"
fi

# Test 6: Frontend has health check
if grep -A20 'frontend:' docker-compose.yml | grep -q 'healthcheck:'; then
    print_pass "Frontend has health check configured"
else
    print_fail "Frontend does not have health check"
fi

# Test 7: Embedding API resource limits increased
if grep -A15 'embedding-api:' docker-compose.yml | grep -q 'cpus: "4"'; then
    print_pass "Embedding API CPU limit increased to 4"
else
    print_fail "Embedding API CPU limit not increased"
fi

print_header "VALIDATING DOCKERFILES"

# Test 8: Backend uses frozen-lockfile
if grep -q 'npm ci --frozen-lockfile' backend/Dockerfile; then
    print_pass "Backend Dockerfile uses --frozen-lockfile"
else
    print_fail "Backend Dockerfile does not use --frozen-lockfile"
fi

# Test 9: Frontend Dockerfile exposes port 80
if grep -q 'EXPOSE 80' frontend/Dockerfile; then
    print_pass "Frontend Dockerfile exposes port 80"
else
    print_fail "Frontend Dockerfile does not expose port 80"
fi

# Test 10: Frontend uses curl for healthcheck
if grep -q 'curl --fail http://localhost/health' frontend/Dockerfile; then
    print_pass "Frontend Dockerfile uses curl for healthcheck"
else
    print_fail "Frontend Dockerfile does not use curl for healthcheck"
fi

# Test 11: Embedding model has PYTHONPATH
if grep -q 'PYTHONPATH=/app' embedding-model/Dockerfile; then
    print_pass "Embedding model Dockerfile sets PYTHONPATH"
else
    print_fail "Embedding model Dockerfile does not set PYTHONPATH"
fi

# Test 12: Nginx Dockerfile has healthcheck
if grep -q 'HEALTHCHECK' nginx/Dockerfile; then
    print_pass "Nginx Dockerfile has health check"
else
    print_fail "Nginx Dockerfile does not have health check"
fi

# Test 13: Nginx Dockerfile copies main config
if grep -q 'COPY nginx.conf' nginx/Dockerfile; then
    print_pass "Nginx Dockerfile copies main nginx.conf"
else
    print_fail "Nginx Dockerfile does not copy main nginx.conf"
fi

print_header "VALIDATING NGINX CONFIGURATION"

# Test 14: Correct embedding service name
if grep -q 'set $embedding_upstream "http://embedding-api:8000"' nginx/conf.d/default.conf; then
    print_pass "Embedding upstream service name is correct (embedding-api)"
else
    print_fail "Embedding upstream service name is incorrect"
fi

# Test 15: X-Frame-Options header in default.conf
if grep -q 'X-Frame-Options' nginx/conf.d/default.conf; then
    print_pass "X-Frame-Options security header present"
else
    print_fail "X-Frame-Options security header missing"
fi

# Test 16: HSTS header in default.conf
if grep -q 'Strict-Transport-Security' nginx/conf.d/default.conf; then
    print_pass "HSTS security header present"
else
    print_fail "HSTS security header missing"
fi

# Test 17: Permissions-Policy header
if grep -q 'Permissions-Policy' nginx/conf.d/default.conf; then
    print_pass "Permissions-Policy security header present"
else
    print_fail "Permissions-Policy security header missing"
fi

# Test 18: Extended timeout for /chat/ endpoint
if grep -A10 'location /chat/' nginx/conf.d/default.conf | grep -q 'proxy_read_timeout 120s'; then
    print_pass "Chat endpoint has extended 120s read timeout"
else
    print_fail "Chat endpoint timeout not properly configured"
fi

print_header "VALIDATING FRONTEND NGINX CONFIG"

# Test 19: Content Security Policy in frontend config
if grep -q 'Content-Security-Policy' frontend/nginx-default.conf; then
    print_pass "Content Security Policy (CSP) header present in frontend config"
else
    print_fail "Content Security Policy (CSP) header missing in frontend config"
fi

# Test 20: Try_files for SPA routing in frontend
if grep -q 'try_files $uri $uri/ /index.html' frontend/nginx-default.conf; then
    print_pass "SPA routing (try_files) properly configured in frontend"
else
    print_fail "SPA routing (try_files) not found in frontend config"
fi

# Test 21: Block source maps in frontend
if grep -q '\.map$' frontend/nginx-default.conf; then
    print_pass "Source maps (.map files) blocked in frontend config"
else
    print_warn "Source maps (.map files) not explicitly blocked"
fi

# Test 22: Static asset caching configured
if grep -q 'expires 1y' frontend/nginx-default.conf; then
    print_pass "Static asset caching configured for 1 year"
else
    print_fail "Static asset caching not properly configured"
fi

print_header "VALIDATING DOCUMENTATION"

# Test 23: Production deployment guide exists
if [ -f "PRODUCTION_DEPLOYMENT_GUIDE.md" ]; then
    print_pass "PRODUCTION_DEPLOYMENT_GUIDE.md exists"
else
    print_fail "PRODUCTION_DEPLOYMENT_GUIDE.md not found"
fi

# Test 24: Audit summary exists
if [ -f "DEPLOYMENT_AUDIT_SUMMARY.md" ]; then
    print_pass "DEPLOYMENT_AUDIT_SUMMARY.md exists"
else
    print_fail "DEPLOYMENT_AUDIT_SUMMARY.md not found"
fi

# Test 25: Change reference guide exists
if [ -f "CHANGE_REFERENCE_GUIDE.md" ]; then
    print_pass "CHANGE_REFERENCE_GUIDE.md exists"
else
    print_fail "CHANGE_REFERENCE_GUIDE.md not found"
fi

# Test 26: Environment example exists
if [ -f ".env.production.example" ]; then
    print_pass ".env.production.example exists"
else
    print_fail ".env.production.example not found"
fi

print_header "VALIDATING FILE PERMISSIONS & CONTENT"

# Test 27: .env is in .gitignore
if [ -f ".gitignore" ] && grep -q '.env' .gitignore; then
    print_pass ".env is in .gitignore (credentials protected)"
else
    print_warn ".env might not be in .gitignore - IMPORTANT: add it!"
fi

# Test 28: Actual .env file should NOT exist locally (will be created on server)
if [ ! -f ".env" ]; then
    print_pass ".env file does not exist (will be created on server)"
else
    print_warn ".env file exists locally - ensure it's NOT committed to git"
fi

print_header "DOCKER SYNTAX VALIDATION"

# Test 29: docker-compose.yml can be parsed
if docker-compose config > /dev/null 2>&1; then
    print_pass "docker-compose.yml syntax is valid"
else
    print_fail "docker-compose.yml has syntax errors"
fi

# Test 30: All Dockerfiles can be validated
if docker build --dry-run backend/ > /dev/null 2>&1; then
    print_pass "backend/Dockerfile syntax is valid"
else
    print_warn "backend/Dockerfile could not be validated (may need dependencies)"
fi

print_header "PRODUCTION READINESS SUMMARY"

echo ""
echo -e "Tests Passed:  ${GREEN}$PASSED${NC}"
echo -e "Tests Failed:  ${RED}$FAILED${NC}"
echo -e "Warnings:      ${YELLOW}$WARNINGS${NC}"
echo ""

# Final verdict
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ PRODUCTION READY${NC}"
    echo ""
    echo "All critical checks passed. The deployment is ready for production."
    echo ""
    echo "Next steps:"
    echo "1. Create .env file with secure credentials"
    echo "2. Review PRODUCTION_DEPLOYMENT_GUIDE.md"
    echo "3. Run pre-deployment checklist"
    echo "4. Deploy to staging first"
    echo "5. Run validation tests again after deployment"
    exit 0
else
    echo -e "${RED}✗ NOT PRODUCTION READY${NC}"
    echo ""
    echo "There are $FAILED critical issues that must be fixed before deployment."
    echo "See failures above and review DEPLOYMENT_AUDIT_SUMMARY.md for details."
    exit 1
fi
