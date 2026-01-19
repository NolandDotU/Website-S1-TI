/**
 * K6 Stress Test
 * Push the system to its breaking point
 * Run: k6 run tests/k6/stress-test.js
 */

import { BASE_URL } from "./config.js";
import { makeGetRequest, checkStandardResponse, testGroup } from "./helpers.js";

export const options = {
  stages: [
    { duration: "5s", target: 50 }, // Ramp-up to 50 VUs
    { duration: "10s", target: 100 }, // Ramp-up to 100 VUs
    { duration: "20s", target: 200 }, // Stress to 200 VUs
    { duration: "10s", target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_failed: ["rate<0.2"], // Allow 20% failures during stress
    http_req_duration: ["p(95)<2000"], // 95% requests under 2s
  },
};

export default function () {
  // Test basic read operations under stress
  testGroup("Read Operations - Stress Test", () => {
    makeGetRequest(`${BASE_URL}/lecturers`);
    makeGetRequest(`${BASE_URL}/announcements`);
    makeGetRequest(`${BASE_URL}/highlight`);
    makeGetRequest(`${BASE_URL}/dashboard`);
  });
}
