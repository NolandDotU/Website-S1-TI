/**
 * K6 Setup and Teardown Script
 * Run with other scripts for automatic setup
 * Run: k6 run tests/k6/setup-teardown-test.js
 */

import http from "k6/http";
import { BASE_URL, mockData } from "./config.js";
import {
  makePostRequest,
  makeAuthenticatedRequest,
  testGroup,
} from "./helpers.js";
import { check } from "k6";

// Setup phase - runs once before test
export function setup() {
  console.log("🔧 Setup phase: Preparing test data");

  const setupData = {
    adminToken: null,
    userId: null,
    announcementId: null,
  };

  // Try to authenticate as admin
  const loginRes = makePostRequest(`${BASE_URL}/auth/login`, {
    email: mockData.admin.email,
    password: mockData.admin.password,
  });

  if (loginRes.status === 200) {
    try {
      const body = JSON.parse(loginRes.body);
      setupData.adminToken = body.data?.accessToken;
      console.log("✅ Admin token obtained");
    } catch (error) {
      console.log("❌ Failed to parse login response");
    }
  } else {
    console.log("⚠️  Admin login failed. Some tests will be skipped.");
  }

  return setupData;
}

// Main test function
export default function (data) {
  testGroup("Using Setup Data", () => {
    if (data.adminToken) {
      // Test authenticated endpoints
      const dashboardRes = makeAuthenticatedRequest(
        "GET",
        `${BASE_URL}/dashboard`,
        data.adminToken,
      );

      check(dashboardRes, {
        "authenticated dashboard access": (r) => r.status === 200,
      });
    }

    // Test public endpoints
    const announcementsRes = http.get(`${BASE_URL}/announcements`, {
      tags: { name: "Announcements" },
    });

    check(announcementsRes, {
      "public announcements access": (r) => r.status === 200,
    });
  });
}

// Teardown phase - runs once after test
export function teardown(data) {
  console.log("🧹 Teardown phase: Cleaning up");

  if (data.adminToken) {
    // Logout if needed
    const logoutRes = makePostRequest(`${BASE_URL}/auth/logout`, {});
    console.log(`Logout status: ${logoutRes.status}`);
  }

  console.log("✅ Cleanup complete");
}
