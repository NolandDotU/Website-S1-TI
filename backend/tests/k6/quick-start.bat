@echo off
REM Quick start script for K6 testing on Windows

echo.
echo =====================================
echo   K6 Load Testing - Quick Start Guide
echo =====================================
echo.

REM Check if K6 is installed
where k6 >nul 2>nul
if %errorlevel% neq 0 (
  echo.
  echo ❌ K6 is not installed!
  echo Please install from: https://k6.io/docs/getting-started/installation
  echo.
  echo Option 1: Using Chocolatey
  echo   choco install k6
  echo.
  echo Option 2: Download installer
  echo   https://github.com/grafana/k6/releases
  echo.
  exit /b 1
)

echo ✅ K6 is installed
k6 version
echo.

echo 📋 Available Tests:
echo.
echo    1 - Smoke Test (quick health check^)
echo    2 - API Routes Test (endpoint coverage^)
echo    3 - Authentication Test (auth flows^)
echo    4 - Load Test (progressive increase^)
echo    5 - Spike Test (sudden traffic^)
echo    6 - Stress Test (breaking point^)
echo    7 - Endurance Test (long-running^)
echo.

set /p choice="Select test (1-7) or press Enter for smoke test [1]: "
if "%choice%"=="" set choice=1

set BASE_URL=http://localhost:5000/api/v1
set /p custom_url="Enter API base URL (default: %BASE_URL%^): "
if not "%custom_url%"=="" set BASE_URL=%custom_url%

echo.
echo 📊 Running test...
echo ================================================
echo.

if "%choice%"=="1" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\smoke-test.js
) else if "%choice%"=="2" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\api-routes-test.js
) else if "%choice%"=="3" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\auth-test.js
) else if "%choice%"=="4" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\load-test.js
) else if "%choice%"=="5" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\spike-test.js
) else if "%choice%"=="6" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\stress-test.js
) else if "%choice%"=="7" (
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\endurance-test.js
) else (
  echo Invalid choice
  exit /b 1
)

echo.
echo ================================================
echo ✅ Test completed!
echo.
echo 💡 Next steps:
echo   - Run setup-teardown-test.js for auth tests
echo   - Export results: k6 run --out json=results.json [test].js
echo   - Check K6 Cloud: https://cloud.k6.io
echo.
pause
