/**
 * K6 Helper Functions
 * Utility functions for K6 tests
 */

import http from "k6/http";
import { check, group } from "k6";
import { defaultHeaders, getStaticAssetTag } from "./config.js";

/**
 * Make a GET request with error handling
 */
export function makeGetRequest(url, params = {}) {
  const tags = {
    endpoint: url,
    method: "GET",
    ...getStaticAssetTag(url),
  };

  try {
    const response = http.get(url, { tags, headers: defaultHeaders });
    return response;
  } catch (error) {
    console.error(`GET request failed for ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Make a POST request with error handling
 */
export function makePostRequest(url, payload, params = {}) {
  const tags = {
    endpoint: url,
    method: "POST",
    ...getStaticAssetTag(url),
  };

  try {
    const response = http.post(url, JSON.stringify(payload), {
      tags,
      headers: defaultHeaders,
    });
    return response;
  } catch (error) {
    console.error(`POST request failed for ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Make a PUT request with error handling
 */
export function makePutRequest(url, payload, params = {}) {
  const tags = {
    endpoint: url,
    method: "PUT",
    ...getStaticAssetTag(url),
  };

  try {
    const response = http.put(url, JSON.stringify(payload), {
      tags,
      headers: defaultHeaders,
    });
    return response;
  } catch (error) {
    console.error(`PUT request failed for ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Make a DELETE request with error handling
 */
export function makeDeleteRequest(url, params = {}) {
  const tags = {
    endpoint: url,
    method: "DELETE",
    ...getStaticAssetTag(url),
  };

  try {
    const response = http.del(url, { tags, headers: defaultHeaders });
    return response;
  } catch (error) {
    console.error(`DELETE request failed for ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Authenticate user and return token
 */
export function authenticateUser(baseUrl, email, password) {
  const loginPayload = {
    email: email,
    password: password,
  };

  const response = makePostRequest(`${baseUrl}/auth/login`, loginPayload);

  check(response, {
    "authentication status is 200": (r) => r.status === 200,
    "response has access token": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.accessToken;
      } catch {
        return false;
      }
    },
  });

  try {
    const body = JSON.parse(response.body);
    return body.data?.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * Make authenticated request
 */
export function makeAuthenticatedRequest(method, url, token, payload = null) {
  const headers = {
    ...defaultHeaders,
    Authorization: `Bearer ${token}`,
  };

  const tags = {
    endpoint: url,
    method: method,
    authenticated: "true",
    ...getStaticAssetTag(url),
  };

  let response;

  try {
    switch (method.toUpperCase()) {
      case "GET":
        response = http.get(url, { tags, headers });
        break;
      case "POST":
        response = http.post(url, JSON.stringify(payload), { tags, headers });
        break;
      case "PUT":
        response = http.put(url, JSON.stringify(payload), { tags, headers });
        break;
      case "DELETE":
        response = http.del(url, { tags, headers });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    return response;
  } catch (error) {
    console.error(`${method} request failed for ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Check standard response format
 */
export function checkStandardResponse(response, expectedStatus = 200) {
  return check(response, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    "response is JSON": (r) =>
      r.headers["Content-Type"].includes("application/json"),
    "response has data field": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data !== undefined || body.error !== undefined;
      } catch {
        return false;
      }
    },
  });
}

/**
 * Extract data from response
 */
export function extractFromResponse(response, path) {
  try {
    const body = JSON.parse(response.body);
    const keys = path.split(".");
    let value = body;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return null;
    }
    return value;
  } catch {
    return null;
  }
}

/**
 * Grouped test execution
 */
export function testGroup(groupName, testFn) {
  group(groupName, testFn);
}

/**
 * Random delay
 */
export function randomDelay(minMs = 100, maxMs = 1000) {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  // K6 doesn't have sleep in all contexts, use busy wait or skip
}

/**
 * Generate random string
 */
export function generateRandomString(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random ID (ObjectId format)
 */
export function generateRandomId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
