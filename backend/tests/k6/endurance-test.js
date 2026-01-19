/**
 * K6 Endurance Test
 * Long-running test to detect memory leaks and degradation
 * Run: k6 run tests/k6/endurance-test.js
 */

import { BASE_URL } from "./config.js";
import { makeGetRequest, checkStandardResponse, testGroup } from "./helpers.js";

export const options = {
  stages: [
    { duration: "2m", target: 10 }, // Ramp-up to 10 VUs
    { duration: "10m", target: 10 }, // Stay at 10 VUs for 10 minutes
    { duration: "2m", target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // 5% failure rate allowed
    http_req_duration: ["p(95)<500"], // 95% requests under 500ms
    http_req_duration: ["p(99)<1000"], // 99% requests under 1s
  },
};

export default function () {
  // Rotate through different endpoints
  testGroup("Endurance - All Endpoints", () => {
    // Lecturers
    const lecturersRes = makeGetRequest(
      `${BASE_URL}/lecturers?page=${Math.floor(Math.random() * 5) + 1}`,
    );
    checkStandardResponse(lecturersRes);

    // Announcements
    const announcementsRes = makeGetRequest(
      `${BASE_URL}/announcements?page=${Math.floor(Math.random() * 5) + 1}`,
    );
    checkStandardResponse(announcementsRes);

    // Highlights
    const highlightsRes = makeGetRequest(`${BASE_URL}/highlight`);
    checkStandardResponse(highlightsRes);

    // Dashboard
    const dashboardRes = makeGetRequest(`${BASE_URL}/dashboard`);
    checkStandardResponse(dashboardRes);

    // History
    const historyRes = makeGetRequest(`${BASE_URL}/history`);
    // Might not be authenticated
  });
}
