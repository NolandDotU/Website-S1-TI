// Simple API stub layer. Replace implementations with real fetch calls.
// Example real fetch: export async function getAnnouncements() { const res = await fetch('/api/announcements'); return res.json(); }

import { announcements } from '../data/announcements';
import { partners } from '../data/partners';
import { highlights } from '../data/highlights';
import { services } from '../data/services';

const simulateLatency = (ms = 300) => new Promise(r => setTimeout(r, ms));

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
