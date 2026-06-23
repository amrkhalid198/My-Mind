/**
 * useNotes — central state for all note operations.
 * Keeps notes in sync with LocalStorage on every change.
 */

import { useState, useEffect, useCallback } from 'react';
import { loadNotes, saveNotes } from '../utils/storage';
import { createNote, updateNote, deleteNote, sortByRecent } from '../utils/notes';

export function useNotes() {
  const [notes, setNotes] = useState(() => {
    // Load from storage on first render only (lazy initializer)
    const loaded = loadNotes();
    return sortByRecent(loaded);
  });

  // Persist to LocalStorage whenever notes change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const addNote = useCallback((noteData) => {
    const note = createNote(noteData);
    setNotes(prev => [note, ...prev]); // prepend — most recent first
    return note.id;
  }, []);

  const editNote = useCallback((id, changes) => {
    setNotes(prev => {
      const updated = updateNote(prev, id, changes);
      return sortByRecent(updated);
    });
  }, []);

  const removeNote = useCallback((id) => {
    setNotes(prev => deleteNote(prev, id));
  }, []);

  return { notes, addNote, editNote, removeNote };
}
