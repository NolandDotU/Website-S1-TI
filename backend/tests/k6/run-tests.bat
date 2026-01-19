@echo off
REM K6 Test Runner Script for Windows
REM Runs various K6 tests with different configurations

setlocal enabledelayedexpansion

REM Default values
set BASE_URL=http://localhost:5000/api/v1
set TEST_TYPE=smoke

REM Parse arguments
:parse_args
if "%1"=="" goto run_test
if "%1"=="--base-url" (
  set BASE_URL=%2
  shift
  shift
  goto parse_args
)
if "%1"=="--test" (
  set TEST_TYPE=%2
  shift
  shift
  goto parse_args
)
if "%1"=="-h" goto show_help
if "%1"=="--help" goto show_help
shift
goto parse_args

:show_help
echo Usage: run-tests.bat [OPTIONS]
echo.
echo Options:
echo   --base-url URL    Set API base URL (default: http://localhost:5000/api/v1)
echo   --test TYPE       Test type: smoke, load, spike, stress, endurance, api, auth, all
echo   -h, --help        Show this help message
echo.
echo Examples:
echo   run-tests.bat --test smoke
echo   run-tests.bat --base-url https://api.example.com --test load
exit /b 0

:run_test
echo.
echo ============================================
echo    K6 Load Testing Suite
echo ============================================
echo.
echo Base URL: %BASE_URL%
echo Test Type: %TEST_TYPE%
echo.

if "%TEST_TYPE%"=="smoke" (
  echo Running Smoke Test...
  k6 run --vus 10 --duration 30s -e BASE_URL="%BASE_URL%" tests\k6\smoke-test.js
) else if "%TEST_TYPE%"=="load" (
  echo Running Load Test...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\load-test.js
) else if "%TEST_TYPE%"=="spike" (
  echo Running Spike Test...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\spike-test.js
) else if "%TEST_TYPE%"=="stress" (
  echo Running Stress Test...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\stress-test.js
) else if "%TEST_TYPE%"=="endurance" (
  echo Running Endurance Test...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\endurance-test.js
) else if "%TEST_TYPE%"=="api" (
  echo Running API Routes Test...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\api-routes-test.js
) else if "%TEST_TYPE%"=="auth" (
  echo Running Authentication Test...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\auth-test.js
) else if "%TEST_TYPE%"=="all" (
  echo Running All Tests...
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\smoke-test.js
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\api-routes-test.js
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\auth-test.js
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\load-test.js
  k6 run -e BASE_URL="%BASE_URL%" tests\k6\spike-test.js
) else (
  echo Unknown test type: %TEST_TYPE%
  echo Available types: smoke, load, spike, stress, endurance, api, auth, all
  exit /b 1
)

echo.
echo ============================================
echo    Testing Complete
echo ============================================
