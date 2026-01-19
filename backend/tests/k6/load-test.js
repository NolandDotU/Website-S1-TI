/**
 * K6 Load Test
 * Progressive load testing for all endpoints
 * Run: k6 run tests/k6/load-test.js
 */

import { BASE_URL, config, mockData } from "./config.js";
import {
  makeGetRequest,
  checkStandardResponse,
  testGroup,
  generateRandomId,
} from "./helpers.js";

export const options = {
  stages: [
    { duration: "10s", target: 5 }, // Ramp-up
    { duration: "30s", target: 20 }, // Hold
    { duration: "10s", target: 0 }, // Ramp-down
  ],
  thresholds: {
    "http_req_duration{endpoint:/lecturers}": ["p(95)<300"],
    "http_req_duration{endpoint:/announcements}": ["p(95)<400"],
    "http_req_duration{endpoint:/highlight}": ["p(95)<400"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  // Test Lecturers endpoints
  testGroup("Lecturers - Load Test", () => {
    // Get all lecturers
    const listRes = makeGetRequest(`${BASE_URL}/lecturers`);
    checkStandardResponse(listRes);

    // Get lecturer with pagination
    const paginatedRes = makeGetRequest(
      `${BASE_URL}/lecturers?page=1&limit=10`,
    );
    checkStandardResponse(paginatedRes);

    // Get lecturer with filter
    const filteredRes = makeGetRequest(
      `${BASE_URL}/lecturers?department=Computer%20Science`,
    );
    checkStandardResponse(filteredRes);
  });

  // Test Announcements endpoints
  testGroup("Announcements - Load Test", () => {
    // Get all announcements
    const listRes = makeGetRequest(`${BASE_URL}/announcements`);
    checkStandardResponse(listRes);

    // Get with pagination
    const paginatedRes = makeGetRequest(
      `${BASE_URL}/announcements?page=1&limit=5`,
    );
    checkStandardResponse(paginatedRes);

    // Get by category
    const categoryRes = makeGetRequest(
      `${BASE_URL}/announcements?category=academic`,
    );
    checkStandardResponse(categoryRes);
  });

  // Test Highlights endpoints
  testGroup("Highlights - Load Test", () => {
    // Get all highlights
    const listRes = makeGetRequest(`${BASE_URL}/highlight`);
    checkStandardResponse(listRes);

    // Get featured highlights
    const featuredRes = makeGetRequest(`${BASE_URL}/highlight?featured=true`);
    checkStandardResponse(featuredRes);
  });

  // Test Dashboard endpoints
  testGroup("Dashboard - Load Test", () => {
    const dashboardRes = makeGetRequest(`${BASE_URL}/dashboard`);
    checkStandardResponse(dashboardRes);

    const statsRes = makeGetRequest(`${BASE_URL}/dashboard/statistics`);
    // May return 400-500 if not authenticated
  });

  // Test History endpoints
  testGroup("History - Load Test", () => {
    const historyRes = makeGetRequest(`${BASE_URL}/history`);
    // May require authentication
  });
}
