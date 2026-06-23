/**
 * NoteRow — a single note entry in a list.
 *
 * Fix applied:
 * - Tags now display with # prefix, consistent with NoteViewScreen
 * - select-none on the whole row (it's a tap target, not readable text)
 */

import { formatDate, getPreview } from '../utils/notes';

export default function NoteRow({ note, onClick }) {
  const { title, content, tags, updatedAt } = note;

  const displayTitle = title.trim()
    || content.split('\n')[0].slice(0, 60)
    || 'Untitled';
  const showPreview = title.trim() && content.trim();

  return (
    <article
      onClick={onClick}
      className="
        px-5 py-4 cursor-pointer select-none
        border-b border-nb-line
        active:bg-nb-surface
        transition-colors duration-75
      "
    >
      {/* Title */}
      <h3 className="
        font-sans text-base font-medium text-nb-primary
        leading-snug min-w-0 break-words text-clamp-1
      ">
        {displayTitle}
      </h3>

      {/* Date + tags inline */}
      <p className="font-mono text-xs text-nb-secondary mt-0.5 mb-1.5 min-w-0 text-clamp-1">
        {formatDate(updatedAt)}
        {tags.length > 0 && (
          <span className="text-nb-muted">
            {' · '}{tags.slice(0, 3).map(t => `#${t}`).join(' ')}
          </span>
        )}
      </p>

      {/* Preview — only when note has both title and body */}
      {showPreview && (
        <p className="
          font-mono text-sm text-nb-secondary
          leading-relaxed min-w-0 break-words text-clamp
        ">
          {getPreview(content, 100)}
        </p>
      )}
    </article>
  );
}
