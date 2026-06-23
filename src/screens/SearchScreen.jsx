/**
 * SearchScreen — primary retrieval interface.
 *
 * Fix applied:
 * - Changed type="search" to type="text" to prevent iOS double-clear button
 *   (type="search" renders native OS clear button + our custom one)
 */

import { useState, useEffect, useRef } from 'react';
import NoteList from '../components/NoteList';
import { searchNotes, sortByRecent } from '../utils/notes';

export default function SearchScreen({ notes, onNoteClick }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Auto-focus on mount — small delay for iOS Safari
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const results = query.trim()
    ? searchNotes(notes, query)
    : sortByRecent(notes);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col h-full">

      {/* Search header */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0 select-none">
        <label
          htmlFor="search-input"
          className="block font-sans text-xs tracking-[0.2em] text-nb-secondary uppercase mb-3"
        >
          Search
        </label>

        <div className="relative">
          {/* type="text" not "search" — avoids iOS native clear button conflict */}
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            inputMode="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="titles, content, tags…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="
              w-full bg-transparent
              font-mono text-base text-nb-primary
              placeholder:text-nb-secondary
              border-0 border-b border-nb-line
              pb-2 pt-1
              focus:outline-none focus:border-nb-accent
              transition-colors duration-150
              pr-16
            "
            style={{ userSelect: 'text' }}
          />

          {hasQuery && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="
                absolute right-0 top-0
                font-mono text-xs text-nb-secondary
                hover:text-nb-primary transition-colors duration-100
              "
              style={{ minHeight: '44px', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="px-5 pb-3 flex-shrink-0 select-none">
        <p className="font-mono text-xs text-nb-muted">
          {hasQuery
            ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
            : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`
          }
        </p>
      </div>

      {/* Divider — matches HomeScreen layout */}
      <div className="border-t border-nb-line flex-shrink-0" />

      {/* Results */}
      <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
        <NoteList
          notes={results}
          onNoteClick={onNoteClick}
          emptyMessage={
            hasQuery
              ? `Nothing found for "${query}"`
              : 'No notes yet.'
          }
        />
        <div className="h-4" />
      </div>

    </div>
  );
}
