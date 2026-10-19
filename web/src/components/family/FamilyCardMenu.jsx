import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Eye, Pencil, Copy, Archive, Trash2 } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'view', label: 'View Details', Icon: Eye, color: 'var(--color-text-1)' },
  { id: 'edit', label: 'Edit', Icon: Pencil, color: '#60A5FA' },
  { id: 'duplicate', label: 'Duplicate', Icon: Copy, color: 'var(--color-text-1)' },
  { id: 'archive', label: 'Archive', Icon: Archive, color: 'var(--color-text-1)' },
  { id: 'delete', label: 'Delete', Icon: Trash2, color: '#EF4444' },
];

export default function FamilyCardMenu({
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  style,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handlers = {
    view: onView,
    edit: onEdit,
    duplicate: onDuplicate,
    archive: onArchive,
    delete: onDelete,
  };

  const run = (id) => {
    setOpen(false);
    handlers[id]?.();
  };

  return (
    <div
      ref={rootRef}
      className={`family-card-menu ${className}`.trim()}
      style={{ position: 'relative', flexShrink: 0, ...style }}
    >
      <button
        type="button"
        aria-label="Card actions"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="family-card-menu-trigger"
      >
        <MoreHorizontal size={16} strokeWidth={2.25} />
      </button>
      {open && (
        <div className="family-card-menu-panel" role="menu">
          {MENU_ITEMS.map(({ id, label, Icon, color }) => (
            <button
              key={id}
              type="button"
              role="menuitem"
              className="family-card-menu-item"
              onClick={() => run(id)}
              style={{ color }}
            >
              <Icon size={15} strokeWidth={2} style={{ color, flexShrink: 0 }} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
