// API service layer
import { announcements } from '../data/announcements';
import { partners } from '../data/partners';
import { highlights } from '../data/highlights';
import { services } from '../data/services';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
const simulateLatency = (ms = 300) => new Promise(r => setTimeout(r, ms));

// Lecturers API
export async function getLecturers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/lecturers/?page=2&limit=10`);
    if (!response.ok) throw new Error('Failed to fetch lecturers');
    const result = await response.json();
    // Backend returns {data: [...]} structure
    return result.data || [];
  } catch (error) {
    console.error('Error fetching lecturers:', error);
    return [];
  }
}

export async function createLecturer(data) {
  const response = await fetch(`${API_BASE_URL}/api/v1/lecturers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create lecturer');
  return response.json();
}

export async function updateLecturer(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/v1/lecturers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update lecturer');
  return response.json();
}

export async function deleteLecturer(id) {
  const response = await fetch(`${API_BASE_URL}/lecturers/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete lecturer');
  return response.json();
}

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
