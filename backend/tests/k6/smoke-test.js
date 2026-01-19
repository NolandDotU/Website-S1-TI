/**
 * K6 Smoke Test
 * Quick health check for all major endpoints
 * Run: k6 run tests/k6/smoke-test.js
 */

import { BASE_URL, mockData } from "./config.js";
import { makeGetRequest, checkStandardResponse, testGroup } from "./helpers.js";

export const options = {
  stages: [{ duration: "1s", target: 1 }],
  thresholds: {
    http_req_failed: ["rate<0.1"],
    http_req_duration: ["p(99)<1500"],
  },
};

export default function () {
  // Health check
  testGroup("Health Check", () => {
    const res = makeGetRequest(`${BASE_URL.replace("/api/v1", "")}/health`);
    checkStandardResponse(res, 200);
  });

  // Lecturers endpoint
  testGroup("Lecturers", () => {
    const res = makeGetRequest(`${BASE_URL}/lecturers`);
    checkStandardResponse(res);
  });

  // Announcements endpoint
  testGroup("Announcements", () => {
    const res = makeGetRequest(`${BASE_URL}/announcements`);
    checkStandardResponse(res);
  });

  // Highlights endpoint
  testGroup("Highlights", () => {
    const res = makeGetRequest(`${BASE_URL}/highlight`);
    checkStandardResponse(res);
  });

  // Chat endpoint
  testGroup("Chat (RAG)", () => {
    const res = makeGetRequest(`${BASE_URL}/chat/health`);
    // May or may not exist
  });

  // Dashboard endpoint
  testGroup("Dashboard", () => {
    const res = makeGetRequest(`${BASE_URL}/dashboard`);
    checkStandardResponse(res);
  });
}
