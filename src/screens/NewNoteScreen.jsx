/**
 * NewNoteScreen — the heart of the app.
 *
 * Distraction-free writing. Used for both New and Edit.
 *
 * Fixes applied:
 * - textarea min-height uses px not vh (safe on all phone sizes)
 * - Cmd/Return hint uses text not emoji (spec: no emoji)
 * - Draft cleared on cancel (no stale draft pollution)
 * - Tags input has visible bottom border (visual affordance)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { loadDraft, saveDraft, clearDraft } from '../utils/storage';
import { normalizeTags } from '../utils/notes';

// Debounce: delay fn execution until deps stop changing for `delay` ms
function useDebouncedEffect(fn, deps, delay) {
  useEffect(() => {
    const timer = setTimeout(fn, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}

export default function NewNoteScreen({ onSave, onCancel, editNote = null }) {
  const isEditing = Boolean(editNote);

  const [title, setTitle]     = useState(() =>
    isEditing ? editNote.title : (loadDraft()?.title || '')
  );
  const [content, setContent] = useState(() =>
    isEditing ? editNote.content : (loadDraft()?.content || '')
  );
  const [tagInput, setTagInput] = useState(() =>
    isEditing ? editNote.tags.join(' ') : (loadDraft()?.tagInput || '')
  );

  const contentRef = useRef(null);
  const titleRef   = useRef(null);

  // Auto-focus: title if empty, body otherwise
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!title.trim()) {
        titleRef.current?.focus();
      } else {
        contentRef.current?.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-grow textarea to fit content
  const autoGrow = useCallback((el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  useEffect(() => {
    if (contentRef.current) autoGrow(contentRef.current);
  }, [content, autoGrow]);

  // Auto-save draft (new notes only, not edits)
  useDebouncedEffect(() => {
    if (!isEditing) {
      saveDraft({ title, content, tagInput });
    }
  }, [title, content, tagInput, isEditing], 500);

  // Save handler
  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    const tags = normalizeTags(tagInput);
    onSave({ title: title.trim(), content: content.trim(), tags });
    if (!isEditing) clearDraft();
  };

  // Cancel: clear draft so next New Note starts fresh
  const handleCancel = () => {
    if (!isEditing) clearDraft();
    onCancel();
  };

  // Cmd/Ctrl+Enter to save
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const canSave = Boolean(title.trim() || content.trim());

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>

      {/* Toolbar — not selectable */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0 select-none">
        <button
          onClick={handleCancel}
          style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          className="font-mono text-sm text-nb-secondary hover:text-nb-primary transition-colors duration-100"
        >
          cancel
        </button>

        <span className="font-sans text-xs tracking-[0.2em] text-nb-secondary uppercase">
          {isEditing ? 'Edit' : 'New note'}
        </span>

        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          className={`
            font-mono text-sm transition-colors duration-100
            ${canSave
              ? 'text-nb-accent hover:text-nb-primary'
              : 'text-nb-muted cursor-not-allowed'
            }
          `}
        >
          save
        </button>
      </div>

      {/* Writing surface — scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 min-h-0">

        {/* Title */}
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title (optional)"
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
          className="
            w-full bg-transparent
            font-sans text-xl font-medium text-nb-primary
            placeholder:text-nb-muted
            border-0 pb-3 pt-1
            focus:outline-none min-w-0
          "
        />

        <div className="border-b border-nb-line mb-4" />

        {/* Body — fixed px min-height, safe on all screen sizes */}
        <textarea
          ref={contentRef}
          value={content}
          onChange={e => { setContent(e.target.value); autoGrow(e.target); }}
          onFocus={e => {
            // Scroll cursor into view after keyboard opens (iOS)
            setTimeout(() => {
              e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 350);
          }}
          placeholder="Write anything…"
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
          rows={1}
          style={{ resize: 'none', overflow: 'hidden', minHeight: '180px' }}
          className="
            w-full bg-transparent
            font-mono text-base leading-relaxed text-nb-primary
            placeholder:text-nb-muted
            border-0 focus:outline-none
            min-w-0 break-words
          "
        />

        {/* Tags */}
        <div className="mt-8 pt-4 border-t border-nb-line">
          <label className="block font-sans text-xs tracking-[0.15em] text-nb-secondary uppercase mb-2 select-none">
            Tags
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="ankle rehab assessment…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="
              w-full bg-transparent
              font-mono text-sm text-nb-primary
              placeholder:text-nb-secondary
              border-0 border-b border-nb-line pb-2
              focus:outline-none focus:border-nb-accent
              transition-colors duration-150
              min-w-0
            "
          />
          <p className="font-mono text-xs text-nb-muted mt-2 select-none">
            Separate with spaces or commas
          </p>
        </div>

        {/* Keyboard shortcut hint — desktop only, plain text (no emoji) */}
        {canSave && (
          <p className="font-mono text-xs text-nb-muted mt-6 hidden sm:block select-none">
            Cmd + Return to save
          </p>
        )}

      </div>
    </div>
  );
}
