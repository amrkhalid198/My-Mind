/**
 * Note CRUD operations and search.
 * All functions are pure — they receive and return arrays.
 * State management happens in App.jsx.
 */

// ─── ID generation ────────────────────────────────────────
export function generateId() {
  // timestamp + 4 random chars — collision-safe for personal use
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Create ───────────────────────────────────────────────
export function createNote({ title = '', content = '', tags = [] }) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: title.trim(),
    content: content.trim(),
    tags: normalizeTags(tags),
    createdAt: now,
    updatedAt: now,
  };
}

// ─── Update ───────────────────────────────────────────────
export function updateNote(notes, id, changes) {
  return notes.map(note =>
    note.id === id
      ? { ...note, ...changes, tags: normalizeTags(changes.tags ?? note.tags), updatedAt: new Date().toISOString() }
      : note
  );
}

// ─── Delete ───────────────────────────────────────────────
export function deleteNote(notes, id) {
  return notes.filter(note => note.id !== id);
}

// ─── Search ───────────────────────────────────────────────
export function searchNotes(notes, query) {
  if (!query.trim()) return notes;
  
  const q = query.toLowerCase().trim();
  
  return notes.filter(note => {
    const inTitle   = note.title.toLowerCase().includes(q);
    const inContent = note.content.toLowerCase().includes(q);
    const inTags    = note.tags.some(tag => tag.toLowerCase().includes(q));
    return inTitle || inContent || inTags;
  });
}

// ─── Sorting ──────────────────────────────────────────────
export function sortByRecent(notes) {
  return [...notes].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
}

// ─── Helpers ──────────────────────────────────────────────
// Normalize tags: split comma/space separated string, trim, lowercase, dedupe
export function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(t => t.trim().toLowerCase()).filter(Boolean);
  // String input from tag input field
  return tags
    .split(/[\s,]+/)
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i); // dedupe
}

// ─── Date formatting ──────────────────────────────────────
export function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1)    return 'just now';
  if (diffMins < 60)   return `${diffMins}m ago`;
  if (diffHours < 24)  return `${diffHours}h ago`;
  if (diffDays === 1)  return 'yesterday';
  if (diffDays < 7)    return `${diffDays} days ago`;
  
  // Older: show full date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// ─── Get preview text ─────────────────────────────────────
export function getPreview(content, maxLength = 80) {
  const clean = content.replace(/\n+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '…';
}
