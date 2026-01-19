/**
 * K6 Authentication Test
 * Test authentication flows and protected routes
 * Run: k6 run tests/k6/auth-test.js
 */

import { BASE_URL, mockData } from "./config.js";
import {
  makePostRequest,
  makeGetRequest,
  makeAuthenticatedRequest,
  checkStandardResponse,
  extractFromResponse,
  testGroup,
} from "./helpers.js";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 5 },
    { duration: "10s", target: 5 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.1"],
  },
};

export default function () {
  // ============ HEALTH CHECK ============
  testGroup("Health Check", () => {
    const res = makeGetRequest(`${BASE_URL.replace("/api/v1", "")}/health`);
    check(res, {
      "health check returns 200": (r) => r.status === 200,
      "response contains status OK": (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.status === "OK";
        } catch {
          return false;
        }
      },
    });
  });

  // ============ AUTHENTICATION ENDPOINTS ============
  testGroup("Auth - Check Me (Unauthenticated)", () => {
    const res = makeGetRequest(`${BASE_URL}/auth/me`);
    check(res, {
      "unauthenticated request fails": (r) =>
        r.status === 401 || r.status === 403,
    });
  });

  // Test registration (if endpoint exists)
  testGroup("Auth - Registration", () => {
    const payload = {
      email: `test-${Date.now()}@example.com`,
      password: mockData.user.password,
      username: `testuser-${Date.now()}`,
    };
    const res = makePostRequest(`${BASE_URL}/auth/register`, payload);
    // Response depends on implementation
  });

  // Test login
  testGroup("Auth - Login with Invalid Credentials", () => {
    const payload = {
      email: "nonexistent@example.com",
      password: "wrongpassword",
    };
    const res = makePostRequest(`${BASE_URL}/auth/login`, payload);
    check(res, {
      "invalid login returns error": (r) =>
        r.status === 401 || r.status === 400,
    });
  });

  // Test check me with admin user (if credentials available)
  testGroup("Auth - Check Me (With Token)", () => {
    const loginPayload = {
      email: mockData.admin.email,
      password: mockData.admin.password,
    };
    const loginRes = makePostRequest(`${BASE_URL}/auth/login`, loginPayload);

    if (loginRes.status === 200) {
      try {
        const body = JSON.parse(loginRes.body);
        const token = body.data?.accessToken;

        if (token) {
          const meRes = makeAuthenticatedRequest(
            "GET",
            `${BASE_URL}/auth/me`,
            token,
          );
          checkStandardResponse(meRes);

          check(meRes, {
            "authenticated request succeeds": (r) => r.status === 200,
            "response contains user data": (r) => {
              try {
                const body = JSON.parse(r.body);
                return body.data?.email !== undefined;
              } catch {
                return false;
              }
            },
          });
        }
      } catch (error) {
        // Skip if parsing fails
      }
    }
  });

  // Test admin endpoint (if exists)
  testGroup("Auth - Admin Check", () => {
    const loginPayload = {
      email: mockData.admin.email,
      password: mockData.admin.password,
    };
    const loginRes = makePostRequest(`${BASE_URL}/auth/login`, loginPayload);

    if (loginRes.status === 200) {
      try {
        const body = JSON.parse(loginRes.body);
        const token = body.data?.accessToken;

        if (token) {
          const adminRes = makeAuthenticatedRequest(
            "GET",
            `${BASE_URL}/auth/admin`,
            token,
          );
          check(adminRes, {
            "admin endpoint accessible": (r) =>
              r.status === 200 || r.status === 403,
          });
        }
      } catch (error) {
        // Skip
      }
    }
  });

  // Test Google OAuth flow (basic)
  testGroup("Auth - Google OAuth Endpoints", () => {
    const googleAuthRes = makeGetRequest(`${BASE_URL}/auth/google`);
    // Should redirect or return auth URL

    const googleCallbackRes = makeGetRequest(
      `${BASE_URL}/auth/google/callback?code=test`,
    );
    // Should fail gracefully with invalid code
    check(googleCallbackRes, {
      "callback endpoint responds": (r) => r.status !== 500,
    });
  });

  // Test logout (if exists)
  testGroup("Auth - Logout", () => {
    const logoutRes = makePostRequest(`${BASE_URL}/auth/logout`, {});
    // Should succeed even without token
    check(logoutRes, {
      "logout endpoint responds": (r) => r.status === 200 || r.status === 401,
    });
  });
}
