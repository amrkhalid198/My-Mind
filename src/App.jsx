/**
 * App.jsx — root component.
 *
 * Screen state machine:
 *   home ──→ view ──→ edit
 *   search ─→ view ──→ edit
 *   any ────→ new
 *
 * `prevScreen` tracks where we came from so Back works correctly.
 */

import { useState, useCallback } from 'react';
import { useNotes } from './hooks/useNotes';

import BottomNav      from './components/BottomNav';
import HomeScreen     from './screens/HomeScreen';
import SearchScreen   from './screens/SearchScreen';
import NewNoteScreen  from './screens/NewNoteScreen';
import NoteViewScreen from './screens/NoteViewScreen';

export default function App() {
  // ─── Screen state ────────────────────────────────────────
  // Valid screens: 'home' | 'search' | 'new' | 'view' | 'edit'
  const [screen, setScreen]         = useState('home');
  const [prevScreen, setPrevScreen] = useState('home'); // for Back navigation
  const [activeNoteId, setActiveNoteId] = useState(null);

  // ─── Note data ───────────────────────────────────────────
  const { notes, addNote, editNote, removeNote } = useNotes();

  // ─── Navigation ──────────────────────────────────────────
  const navigate = useCallback((target) => {
    setPrevScreen(screen); // remember where we are before moving
    setScreen(target);
    if (target !== 'view' && target !== 'edit') {
      setActiveNoteId(null);
    }
  }, [screen]);

  // Open a note — remember which list screen we came from
  const openNote = useCallback((id) => {
    setPrevScreen(screen); // 'home' or 'search'
    setActiveNoteId(id);
    setScreen('view');
  }, [screen]);

  // ─── Note actions ────────────────────────────────────────
  const handleSaveNew = useCallback((data) => {
    addNote(data);
    setScreen('home');
    setPrevScreen('home');
    setActiveNoteId(null);
  }, [addNote]);

  const handleSaveEdit = useCallback((data) => {
    editNote(activeNoteId, data);
    setScreen('view');
  }, [editNote, activeNoteId]);

  const handleDelete = useCallback((id) => {
    removeNote(id);
    // Go back to wherever we came from (home or search)
    const dest = prevScreen === 'search' ? 'search' : 'home';
    setScreen(dest);
    setActiveNoteId(null);
  }, [removeNote, prevScreen]);

  // Back from view → go to previous list screen (home or search)
  const handleBack = useCallback(() => {
    const dest = prevScreen === 'search' ? 'search' : 'home';
    setScreen(dest);
    setActiveNoteId(null);
  }, [prevScreen]);

  // ─── Derived state ───────────────────────────────────────
  const activeNote = activeNoteId
    ? notes.find(n => n.id === activeNoteId) || null
    : null;

  // Hide bottom nav during writing (keyboard screens)
  const showBottomNav = screen !== 'new' && screen !== 'edit';

  // For BottomNav active state: treat 'view'/'edit' as belonging to prev list screen
  const navActiveScreen = (screen === 'view' || screen === 'edit')
    ? prevScreen
    : screen;

  // ─── Render ──────────────────────────────────────────────
  return (
    /*
     * App shell: full dynamic viewport height.
     *
     * `100dvh` accounts for iOS Safari collapsible toolbar.
     * `-webkit-fill-available` is the fallback for older iOS.
     * `paddingTop: env(safe-area-inset-top)` handles notch / Dynamic Island.
     *
     * `select-none` removed from here — applied only to non-text UI elements.
     */
    <div
      className="flex flex-col bg-nb-bg text-nb-primary overflow-hidden"
      style={{
        height: '100dvh',
        minHeight: '-webkit-fill-available',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/*
       * Main content area.
       * padding-bottom clears the fixed BottomNav (≈64px) + safe area.
       * Removed during writing screens so keyboard has full space.
       */}
      <main
        className="flex-1 overflow-hidden"
        style={{
          paddingBottom: showBottomNav
            ? 'calc(64px + env(safe-area-inset-bottom))'
            : '0px',
        }}
      >
        <div className="h-full">

          {screen === 'home' && (
            <HomeScreen
              notes={notes}
              onNoteClick={openNote}
              onSearchFocus={() => navigate('search')}
            />
          )}

          {screen === 'search' && (
            <SearchScreen
              notes={notes}
              onNoteClick={openNote}
            />
          )}

          {screen === 'new' && (
            <NewNoteScreen
              onSave={handleSaveNew}
              onCancel={() => navigate('home')}
            />
          )}

          {/* Edit: reuse NewNoteScreen with existing note data */}
          {screen === 'edit' && activeNote && (
            <NewNoteScreen
              editNote={activeNote}
              onSave={handleSaveEdit}
              onCancel={() => setScreen('view')}
            />
          )}

          {/* Edit fallback: note vanished (shouldn't happen but guard it) */}
          {screen === 'edit' && !activeNote && (
            <div className="flex items-center justify-center h-full">
              <p className="font-mono text-sm text-nb-secondary">Note not found.</p>
            </div>
          )}

          {screen === 'view' && activeNote && (
            <NoteViewScreen
              note={activeNote}
              onBack={handleBack}
              onEdit={() => setScreen('edit')}
              onDelete={handleDelete}
            />
          )}

          {screen === 'view' && !activeNote && (
            <div className="flex items-center justify-center h-full">
              <p className="font-mono text-sm text-nb-secondary">Note not found.</p>
            </div>
          )}

        </div>
      </main>

      {showBottomNav && (
        <BottomNav
          screen={navActiveScreen}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}
