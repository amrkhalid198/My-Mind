/**
 * NoteList — renders a list of NoteRows.
 *
 * Fix: removed `border-t` from the wrapper div.
 * Each NoteRow already has `border-b`, so the list self-divides.
 * The top border was creating a double-line against header edges.
 * The calling screen is responsible for any section separator above the list.
 */

import NoteRow from './NoteRow';

export default function NoteList({ notes, onNoteClick, emptyMessage = 'No notes yet.' }) {
  if (notes.length === 0) {
    return (
      <div className="px-5 pt-12 text-center select-none">
        <p className="font-mono text-sm text-nb-secondary">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      {notes.map(note => (
        <NoteRow
          key={note.id}
          note={note}
          onClick={() => onNoteClick(note.id)}
        />
      ))}
    </div>
  );
}
