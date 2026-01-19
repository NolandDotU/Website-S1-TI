/**
 * K6 Spike Test
 * Sudden traffic spike testing
 * Run: k6 run tests/k6/spike-test.js
 */

import { BASE_URL } from "./config.js";
import { makeGetRequest, checkStandardResponse, testGroup } from "./helpers.js";

export const options = {
  stages: [
    { duration: "5s", target: 10 }, // Normal traffic
    { duration: "5s", target: 100 }, // SPIKE!
    { duration: "5s", target: 50 }, // Return to normal
    { duration: "5s", target: 0 }, // Cool down
  ],
  thresholds: {
    http_req_failed: ["rate<0.1"], // Allow 10% failure during spike
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  testGroup("Lecturers Endpoint - Spike Test", () => {
    const res = makeGetRequest(`${BASE_URL}/lecturers`);
    checkStandardResponse(res);
  });

  testGroup("Announcements Endpoint - Spike Test", () => {
    const res = makeGetRequest(`${BASE_URL}/announcements?page=1&limit=10`);
    checkStandardResponse(res);
  });

  testGroup("Highlights Endpoint - Spike Test", () => {
    const res = makeGetRequest(`${BASE_URL}/highlight`);
    checkStandardResponse(res);
  });

  testGroup("Dashboard Endpoint - Spike Test", () => {
    const res = makeGetRequest(`${BASE_URL}/dashboard`);
    // May fail if not authenticated
  });
}
