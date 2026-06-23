/**
 * LocalStorage utilities for My Brain.
 * 
 * Storage keys:
 *   'mb_notes'  — array of note objects
 *   'mb_draft'  — current unsaved draft
 */

const NOTES_KEY = 'mb_notes';
const DRAFT_KEY = 'mb_draft';

// ─── Notes ────────────────────────────────────────────────
export function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    // Storage quota exceeded — fail silently in production
    console.warn('Storage write failed:', e);
  }
}

// ─── Draft ────────────────────────────────────────────────
export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
