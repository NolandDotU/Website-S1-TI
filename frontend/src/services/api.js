// API service layer
import { announcements } from "../data/announcements";
import { partners } from "../data/partners";
import { highlights } from "../data/highlights";
import { services } from "../data/services";

const simulateLatency = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// Mock data APIs
export async function getAnnouncements() {
  await simulateLatency();
  return announcements;
}

export async function getPartners() {
  await simulateLatency();
  return partners;
}

export async function getHighlights() {
  await simulateLatency();
  return highlights;
}

export async function getServices() {
  await simulateLatency();
  return services;
}
