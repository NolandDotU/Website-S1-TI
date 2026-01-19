/**
 * K6 Configuration and Constants
 * Central configuration for all K6 tests
 */

export const BASE_URL = __ENV.BASE_URL || "http://localhost:5000/api/v1";
export const FRONTEND_URL = __ENV.FRONTEND_URL || "http://localhost:3000";

// Test configuration
export const config = {
  // Thresholds for pass/fail
  thresholds: {
    "http_req_duration{staticAsset:yes}": ["p(95)<1250", "p(99)<1500"],
    "http_req_duration{staticAsset:no}": ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.1"],
    http_reqs: ["count>100"],
  },

  // VU (Virtual User) configurations
  stages: [
    // Ramp-up: linearly increase to 10 VUs during 5s
    { duration: "5s", target: 10 },
    // Stay at 10 VUs for 10s
    { duration: "10s", target: 10 },
    // Ramp-down: linearly decrease to 0 VUs over 5s
    { duration: "5s", target: 0 },
  ],
};

// Mock data
export const mockData = {
  lecturer: {
    name: "Dr. John Doe",
    email: "john@example.com",
    phone: "08123456789",
    bio: "Experienced educator and researcher",
    department: "Computer Science",
    expertise: ["AI", "Machine Learning"],
  },

  announcement: {
    title: "Important Notice",
    content: "This is a test announcement",
    category: "academic",
    published: true,
  },

  highlight: {
    title: "Campus Achievement",
    description: "Students achieved great results",
    imageUrl: "/uploads/highlights/test.jpg",
    featured: true,
  },

  user: {
    username: "testuser",
    email: "testuser@example.com",
    password: "TestPassword123!",
    role: "user",
  },

  admin: {
    email: "admin@example.com",
    password: "AdminPassword123!",
  },

  chatMessage: {
    message: "What is the computer science curriculum?",
  },
};

// Helper function for request metadata
export const getStaticAssetTag = (url) => ({
  staticAsset: url.includes("/uploads") ? "yes" : "no",
});

// Default headers
export const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent": "K6-Load-Test/1.0",
};
