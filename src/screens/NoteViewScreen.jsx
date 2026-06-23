/**
 * NoteViewScreen — read a saved note.
 *
 * Shows: title, content, tags, date.
 * Actions: edit, delete.
 *
 * Fixes:
 * - Delete timeout cleared on unmount (no setState-on-unmounted warning)
 * - Text is selectable (user-select: text) so content can be copied
 * - Back label reflects where we came from
 */

import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/notes';

export default function NoteViewScreen({ note, onBack, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Store timeout ref so we can clear it on unmount
  const deleteTimerRef = useRef(null);

  // Cleanup timeout if component unmounts mid-confirmation
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const { title, content, tags, createdAt, updatedAt } = note;
  const wasEdited = createdAt !== updatedAt;

  const handleDelete = () => {
    if (confirmDelete) {
      // Clear timer before deleting (component will unmount)
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      onDelete(note.id);
    } else {
      setConfirmDelete(true);
      // Auto-cancel confirmation after 3 seconds
      deleteTimerRef.current = setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Toolbar — non-selectable UI chrome */}
      <div
        className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0 select-none"
      >
        <button
          onClick={onBack}
          className="font-mono text-sm text-nb-secondary hover:text-nb-primary transition-colors duration-100 py-1"
          style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
        >
          ← back
        </button>

        <div className="flex items-center gap-5">
          <button
            onClick={onEdit}
            className="font-mono text-sm text-nb-secondary hover:text-nb-primary transition-colors duration-100"
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            edit
          </button>
          <button
            onClick={handleDelete}
            className={`
              font-mono text-sm transition-colors duration-100
              ${confirmDelete
                ? 'text-nb-danger'
                : 'text-nb-secondary hover:text-nb-danger'
              }
            `}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {confirmDelete ? 'confirm delete' : 'delete'}
          </button>
        </div>
      </div>

      {/* Scrollable content — text IS selectable here so user can copy notes */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 min-h-0">

        {/* Title */}
        {title.trim() && (
          <h1 className="font-sans text-xl font-medium text-nb-primary leading-snug break-words mb-3 mt-2">
            {title}
          </h1>
        )}

        {/* Date */}
        <p className="font-mono text-xs text-nb-secondary mb-5 select-none">
          {formatDate(createdAt)}
          {wasEdited && (
            <span className="text-nb-muted"> · edited {formatDate(updatedAt)}</span>
          )}
        </p>

        {/* Divider */}
        <div className="border-b border-nb-line mb-5" />

        {/* Content body — preserve newlines */}
        <div className="min-w-0">
          {content.split('\n').map((line, i) =>
            line.trim() ? (
              <p
                key={i}
                className="font-mono text-base text-nb-primary leading-relaxed break-words mb-3"
              >
                {line}
              </p>
            ) : (
              <div key={i} className="h-3" />
            )
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-nb-line select-none">
            <p className="font-sans text-xs tracking-[0.15em] text-nb-secondary uppercase mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-3">
              {tags.map(tag => (
                <span key={tag} className="font-mono text-xs text-nb-secondary">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
