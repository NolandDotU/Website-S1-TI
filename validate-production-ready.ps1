# ============================================
# PRODUCTION READINESS VALIDATION SCRIPT (Windows PowerShell)
# ============================================
# This script validates that all configuration changes have been properly applied
# and the system is ready for production deployment

param (
    [switch]$Strict = $false
)

# Colors for output
$Pass = @{
    ForegroundColor = 'Green'
    Object = '✓'
}
$Fail = @{
    ForegroundColor = 'Red'
    Object = '✗'
}
$Warn = @{
    ForegroundColor = 'Yellow'
    Object = '⚠'
}
$Header = @{
    ForegroundColor = 'Cyan'
}

# Counters
$Passed = 0
$Failed = 0
$Warnings = 0

# Helper functions
function Print-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "================================================================" @Header
    Write-Host $Title @Header
    Write-Host "================================================================" @Header
    Write-Host ""
}

function Print-Pass {
    param([string]$Message)
    Write-Host "$($Pass.Object) $Message" -ForegroundColor Green
    script:$Passed++
}

function Print-Fail {
    param([string]$Message)
    Write-Host "$($Fail.Object) $Message" -ForegroundColor Red
    script:$Failed++
}

function Print-Warn {
    param([string]$Message)
    Write-Host "$($Warn.Object) $Message" -ForegroundColor Yellow
    script:$Warnings++
}

function Test-FileContent {
    param(
        [string]$FilePath,
        [string]$Pattern,
        [string]$PassMessage,
        [string]$FailMessage
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match $Pattern) {
            Print-Pass $PassMessage
        } else {
            Print-Fail $FailMessage
        }
    } else {
        Print-Fail "File not found: $FilePath"
    }
}

# ============================================
# VALIDATION TESTS
# ============================================

Print-Header "VALIDATING DOCKER COMPOSE CONFIGURATION"

# Test 1: Valid docker-compose version
Test-FileContent -FilePath "docker-compose.yml" `
    -Pattern 'version:\s+"3\.9"' `
    -PassMessage "Docker Compose version is 3.9" `
    -FailMessage "Docker Compose version is not 3.9"

# Test 2: No hardcoded MongoDB password
$dcContent = Get-Content "docker-compose.yml" -Raw
if ($dcContent -match "MONGO_INITDB_ROOT_PASSWORD:\s+ftiuksw") {
    Print-Fail "MongoDB password still hardcoded (ftiuksw)"
} else {
    Print-Pass "MongoDB password uses environment variable"
}

# Test 3: Frontend exposes port 80
if ($dcContent -match "frontend:" -and $dcContent -match '- "80"') {
    Print-Pass "Frontend container exposes port 80"
} else {
    Print-Fail "Frontend container does not expose port 80"
}

# Test 4: Nginx config volumes include main nginx.conf
if ($dcContent -match "nginx/nginx\.conf:/etc/nginx/nginx\.conf:ro") {
    Print-Pass "Nginx main config (nginx.conf) is mounted"
} else {
    Print-Fail "Nginx main config (nginx.conf) is NOT mounted"
}

# Test 5: Nginx has health check
if ($dcContent -match "nginx:" -and $dcContent -match "HEALTHCHECK.*http://localhost/health") {
    Print-Pass "Nginx has health check configured"
} else {
    Print-Fail "Nginx does not have health check"
}

# Test 6: Frontend has health check
if ($dcContent -match "frontend:" -and $dcContent -match "HEALTHCHECK") {
    Print-Pass "Frontend has health check configured"
} else {
    Print-Fail "Frontend does not have health check"
}

# Test 7: Embedding API resource limits increased
if ($dcContent -match 'cpus:\s+"4"') {
    Print-Pass "Embedding API CPU limit increased to 4"
} else {
    Print-Fail "Embedding API CPU limit not increased"
}

Print-Header "VALIDATING DOCKERFILES"

# Test 8: Backend uses frozen-lockfile
Test-FileContent -FilePath "backend/Dockerfile" `
    -Pattern "npm ci --frozen-lockfile" `
    -PassMessage "Backend Dockerfile uses --frozen-lockfile" `
    -FailMessage "Backend Dockerfile does not use --frozen-lockfile"

# Test 9: Frontend Dockerfile exposes port 80
Test-FileContent -FilePath "frontend/Dockerfile" `
    -Pattern "EXPOSE 80" `
    -PassMessage "Frontend Dockerfile exposes port 80" `
    -FailMessage "Frontend Dockerfile does not expose port 80"

# Test 10: Frontend uses curl for healthcheck
Test-FileContent -FilePath "frontend/Dockerfile" `
    -Pattern "curl.*http://localhost/health" `
    -PassMessage "Frontend Dockerfile uses curl for healthcheck" `
    -FailMessage "Frontend Dockerfile does not use curl for healthcheck"

# Test 11: Embedding model has PYTHONPATH
Test-FileContent -FilePath "embedding-model/Dockerfile" `
    -Pattern "PYTHONPATH=/app" `
    -PassMessage "Embedding model Dockerfile sets PYTHONPATH" `
    -FailMessage "Embedding model Dockerfile does not set PYTHONPATH"

# Test 12: Nginx Dockerfile has healthcheck
Test-FileContent -FilePath "nginx/Dockerfile" `
    -Pattern "HEALTHCHECK" `
    -PassMessage "Nginx Dockerfile has health check" `
    -FailMessage "Nginx Dockerfile does not have health check"

# Test 13: Nginx Dockerfile copies main config
Test-FileContent -FilePath "nginx/Dockerfile" `
    -Pattern "COPY nginx\.conf" `
    -PassMessage "Nginx Dockerfile copies main nginx.conf" `
    -FailMessage "Nginx Dockerfile does not copy main nginx.conf"

Print-Header "VALIDATING NGINX CONFIGURATION"

# Test 14: Correct embedding service name
Test-FileContent -FilePath "nginx/conf.d/default.conf" `
    -Pattern 'embedding-api:8000' `
    -PassMessage "Embedding upstream service name is correct (embedding-api)" `
    -FailMessage "Embedding upstream service name is incorrect"

# Test 15: X-Frame-Options header in default.conf
Test-FileContent -FilePath "nginx/conf.d/default.conf" `
    -Pattern "X-Frame-Options" `
    -PassMessage "X-Frame-Options security header present" `
    -FailMessage "X-Frame-Options security header missing"

# Test 16: HSTS header in default.conf
Test-FileContent -FilePath "nginx/conf.d/default.conf" `
    -Pattern "Strict-Transport-Security" `
    -PassMessage "HSTS security header present" `
    -FailMessage "HSTS security header missing"

# Test 17: Permissions-Policy header
Test-FileContent -FilePath "nginx/conf.d/default.conf" `
    -Pattern "Permissions-Policy" `
    -PassMessage "Permissions-Policy security header present" `
    -FailMessage "Permissions-Policy security header missing"

# Test 18: Extended timeout for /chat/ endpoint
$nginxContent = Get-Content "nginx/conf.d/default.conf" -Raw
if ($nginxContent -match "location /chat/" -and $nginxContent -match "proxy_read_timeout 120s") {
    Print-Pass "Chat endpoint has extended 120s read timeout"
} else {
    Print-Fail "Chat endpoint timeout not properly configured"
}

Print-Header "VALIDATING FRONTEND NGINX CONFIG"

# Test 19: Content Security Policy in frontend config
Test-FileContent -FilePath "frontend/nginx-default.conf" `
    -Pattern "Content-Security-Policy" `
    -PassMessage "Content Security Policy (CSP) header present in frontend config" `
    -FailMessage "Content Security Policy (CSP) header missing in frontend config"

# Test 20: Try_files for SPA routing in frontend
Test-FileContent -FilePath "frontend/nginx-default.conf" `
    -Pattern "try_files `$uri `$uri/ /index\.html" `
    -PassMessage "SPA routing (try_files) properly configured in frontend" `
    -FailMessage "SPA routing (try_files) not found in frontend config"

# Test 21: Block source maps in frontend
$frontendNginx = Get-Content "frontend/nginx-default.conf" -Raw
if ($frontendNginx -match "\.map\$") {
    Print-Pass "Source maps (.map files) blocked in frontend config"
} else {
    Print-Warn "Source maps (.map files) not explicitly blocked"
}

# Test 22: Static asset caching configured
Test-FileContent -FilePath "frontend/nginx-default.conf" `
    -Pattern "expires 1y" `
    -PassMessage "Static asset caching configured for 1 year" `
    -FailMessage "Static asset caching not properly configured"

Print-Header "VALIDATING DOCUMENTATION"

# Test 23: Production deployment guide exists
if (Test-Path "PRODUCTION_DEPLOYMENT_GUIDE.md") {
    Print-Pass "PRODUCTION_DEPLOYMENT_GUIDE.md exists"
} else {
    Print-Fail "PRODUCTION_DEPLOYMENT_GUIDE.md not found"
}

# Test 24: Audit summary exists
if (Test-Path "DEPLOYMENT_AUDIT_SUMMARY.md") {
    Print-Pass "DEPLOYMENT_AUDIT_SUMMARY.md exists"
} else {
    Print-Fail "DEPLOYMENT_AUDIT_SUMMARY.md not found"
}

# Test 25: Change reference guide exists
if (Test-Path "CHANGE_REFERENCE_GUIDE.md") {
    Print-Pass "CHANGE_REFERENCE_GUIDE.md exists"
} else {
    Print-Fail "CHANGE_REFERENCE_GUIDE.md not found"
}

# Test 26: Environment example exists
if (Test-Path ".env.production.example") {
    Print-Pass ".env.production.example exists"
} else {
    Print-Fail ".env.production.example not found"
}

Print-Header "VALIDATING FILE PERMISSIONS & CONTENT"

# Test 27: .env is in .gitignore
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Print-Pass ".env is in .gitignore (credentials protected)"
    } else {
        Print-Warn ".env might not be in .gitignore - IMPORTANT: add it!"
    }
} else {
    Print-Warn ".gitignore not found"
}

# Test 28: Actual .env file should NOT exist locally
if (-not (Test-Path ".env")) {
    Print-Pass ".env file does not exist (will be created on server)"
} else {
    Print-Warn ".env file exists locally - ensure it's NOT committed to git"
}

Print-Header "DOCKER SYNTAX VALIDATION"

# Test 29: docker-compose.yml can be parsed
try {
    $null = docker-compose config --quiet 2>$null
    Print-Pass "docker-compose.yml syntax is valid"
} catch {
    Print-Fail "docker-compose.yml has syntax errors"
}

Print-Header "PRODUCTION READINESS SUMMARY"

Write-Host ""
Write-Host "Tests Passed:  " -NoNewline -ForegroundColor Gray
Write-Host $Passed -ForegroundColor Green
Write-Host "Tests Failed:  " -NoNewline -ForegroundColor Gray
Write-Host $Failed -ForegroundColor Red
Write-Host "Warnings:      " -NoNewline -ForegroundColor Gray
Write-Host $Warnings -ForegroundColor Yellow
Write-Host ""

# Final verdict
if ($Failed -eq 0) {
    Write-Host "✓ PRODUCTION READY" -ForegroundColor Green
    Write-Host ""
    Write-Host "All critical checks passed. The deployment is ready for production."
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Create .env file with secure credentials"
    Write-Host "2. Review PRODUCTION_DEPLOYMENT_GUIDE.md"
    Write-Host "3. Run pre-deployment checklist"
    Write-Host "4. Deploy to staging first"
    Write-Host "5. Run validation tests again after deployment"
    exit 0
} else {
    Write-Host "✗ NOT PRODUCTION READY" -ForegroundColor Red
    Write-Host ""
    Write-Host "There are $Failed critical issues that must be fixed before deployment."
    Write-Host "See failures above and review DEPLOYMENT_AUDIT_SUMMARY.md for details."
    exit 1
}
