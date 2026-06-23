/**
 * HomeScreen — landing view.
 *
 * Shows recent notes and a search shortcut.
 * The thin divider before the note list is placed here (not in NoteList)
 * so we control exactly where it sits relative to the note count label.
 */

import NoteList from '../components/NoteList';

export default function HomeScreen({ notes, onNoteClick, onSearchFocus }) {
  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex-shrink-0 select-none">
        <h1 className="font-sans text-xs font-medium tracking-[0.2em] text-nb-secondary uppercase mb-4">
          My Brain
        </h1>

        {/* Tapping navigates to the full Search screen */}
        <button
          onClick={onSearchFocus}
          className="
            w-full text-left
            px-3 py-2.5
            border border-nb-line
            font-mono text-sm text-nb-secondary
            bg-transparent
            transition-colors duration-100
            hover:border-nb-muted active:border-nb-muted
          "
        >
          Search notes…
        </button>
      </header>

      {/* Section label */}
      <div className="px-5 pb-3 flex-shrink-0 select-none">
        <p className="font-mono text-xs text-nb-muted">
          {notes.length === 0
            ? 'No notes yet'
            : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`
          }
        </p>
      </div>

      {/* Divider — owned by HomeScreen, not NoteList */}
      <div className="border-t border-nb-line flex-shrink-0" />

      {/* Scrollable note list */}
      <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
        <NoteList
          notes={notes}
          onNoteClick={onNoteClick}
          emptyMessage="Tap + New to capture your first note."
        />
        <div className="h-4" />
      </div>

    </div>
  );
}
