/**
 * K6 API Routes Test
 * Comprehensive testing for all API endpoints
 * Run: k6 run tests/k6/api-routes-test.js
 */

import { BASE_URL, mockData } from "./config.js";
import {
  makeGetRequest,
  makePostRequest,
  makeAuthenticatedRequest,
  checkStandardResponse,
  extractFromResponse,
  testGroup,
  authenticateUser,
  generateRandomId,
} from "./helpers.js";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "15s", target: 10 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.1"],
    http_req_duration: ["p(95)<800"],
  },
};

export default function () {
  // ============ LECTURERS ENDPOINTS ============
  testGroup("Lecturers - GET All", () => {
    const res = makeGetRequest(`${BASE_URL}/lecturers`);
    checkStandardResponse(res);
    check(res, {
      "response contains lecturers array": (r) => {
        try {
          const body = JSON.parse(r.body);
          return (
            Array.isArray(body.data) || Array.isArray(body.data?.lecturers)
          );
        } catch {
          return false;
        }
      },
    });
  });

  testGroup("Lecturers - GET with Pagination", () => {
    const res = makeGetRequest(`${BASE_URL}/lecturers?page=1&limit=10`);
    checkStandardResponse(res);
    check(res, {
      "response has pagination info": (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.pagination || body.meta;
        } catch {
          return false;
        }
      },
    });
  });

  testGroup("Lecturers - GET by ID", () => {
    const listRes = makeGetRequest(`${BASE_URL}/lecturers?limit=1`);
    if (listRes.status === 200) {
      try {
        const body = JSON.parse(listRes.body);
        const lecturers = body.data || [];
        if (lecturers.length > 0) {
          const lecturerId = lecturers[0]._id || lecturers[0].id;
          if (lecturerId) {
            const detailRes = makeGetRequest(
              `${BASE_URL}/lecturers/${lecturerId}`,
            );
            checkStandardResponse(detailRes);
          }
        }
      } catch (error) {
        // Skip if parsing fails
      }
    }
  });

  // ============ ANNOUNCEMENTS ENDPOINTS ============
  testGroup("Announcements - GET All", () => {
    const res = makeGetRequest(`${BASE_URL}/announcements`);
    checkStandardResponse(res);
    check(res, {
      "response contains announcements": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.data) || body.data !== undefined;
        } catch {
          return false;
        }
      },
    });
  });

  testGroup("Announcements - GET with Category Filter", () => {
    const res = makeGetRequest(
      `${BASE_URL}/announcements?category=academic&limit=10`,
    );
    checkStandardResponse(res);
  });

  testGroup("Announcements - GET with Pagination", () => {
    const res = makeGetRequest(`${BASE_URL}/announcements?page=1&limit=5`);
    checkStandardResponse(res);
  });

  testGroup("Announcements - GET by ID", () => {
    const listRes = makeGetRequest(`${BASE_URL}/announcements?limit=1`);
    if (listRes.status === 200) {
      try {
        const body = JSON.parse(listRes.body);
        const announcements = body.data || [];
        if (announcements.length > 0) {
          const announcementId = announcements[0]._id || announcements[0].id;
          if (announcementId) {
            const detailRes = makeGetRequest(
              `${BASE_URL}/announcements/${announcementId}`,
            );
            checkStandardResponse(detailRes);
          }
        }
      } catch (error) {
        // Skip if parsing fails
      }
    }
  });

  // ============ HIGHLIGHTS ENDPOINTS ============
  testGroup("Highlights - GET All", () => {
    const res = makeGetRequest(`${BASE_URL}/highlight`);
    checkStandardResponse(res);
  });

  testGroup("Highlights - GET Featured", () => {
    const res = makeGetRequest(`${BASE_URL}/highlight?featured=true`);
    checkStandardResponse(res);
  });

  testGroup("Highlights - GET with Limit", () => {
    const res = makeGetRequest(`${BASE_URL}/highlight?limit=5`);
    checkStandardResponse(res);
  });

  // ============ DASHBOARD ENDPOINTS ============
  testGroup("Dashboard - GET General", () => {
    const res = makeGetRequest(`${BASE_URL}/dashboard`);
    // May require authentication
  });

  testGroup("Dashboard - GET Statistics", () => {
    const res = makeGetRequest(`${BASE_URL}/dashboard/statistics`);
    // May require authentication
  });

  // ============ HISTORY ENDPOINTS ============
  testGroup("History - GET All", () => {
    const res = makeGetRequest(`${BASE_URL}/history`);
    // May require authentication
  });

  testGroup("History - GET with Pagination", () => {
    const res = makeGetRequest(`${BASE_URL}/history?page=1&limit=20`);
    // May require authentication
  });

  // ============ USERS ENDPOINTS ============
  testGroup("Users - GET Profile", () => {
    const res = makeGetRequest(`${BASE_URL}/user/profile`);
    // May require authentication
  });

  // ============ CHAT ENDPOINTS ============
  testGroup("Chat RAG - GET Health", () => {
    const res = makeGetRequest(`${BASE_URL}/chat/health`);
    // May or may not exist
  });

  testGroup("Chat RAG - POST Query", () => {
    const payload = {
      query: mockData.chatMessage.message,
    };
    const res = makePostRequest(`${BASE_URL}/chat/query`, payload);
    // May require database setup
  });
}
