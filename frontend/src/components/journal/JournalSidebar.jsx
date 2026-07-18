import React from 'react';
import { Search, Download, BookOpen } from 'lucide-react';
import { entryMatchesSearch, getEntryPreview, MODE_LABELS, parseEntry } from './journalUtils';
import { SkeletonRow } from '../ui/Skeleton';
import { formatDate } from '../../utils/formatDate';

export default function JournalSidebar({
  entries,
  loading,
  search,
  onSearch,
  modeFilter,
  onModeFilter,
  selectedId,
  onSelect,
  onExport,
  analysisMap = {},
}) {
  const filtered = entries
    .filter((e) => {
      if (modeFilter === 'all') return true;
      return parseEntry(e.encrypted_content).mode === modeFilter;
    })
    .filter((e) => entryMatchesSearch(e, search))
    .slice(0, 30);

  return (
    <aside className="journal-sidebar">
      <div className="journal-sidebar__head">
        <div className="journal-sidebar__head-row">
          <div>
            <span className="text-label journal-sidebar__history-label">History</span>
            <p className="journal-sidebar__sub">Search and revisit past entries.</p>
          </div>
          <button
            type="button"
            onClick={onExport}
            aria-label="Export journal"
            className="journal-sidebar__export"
          >
            <Download size={14} aria-hidden="true" /> Export
          </button>
        </div>
        <div className="journal-sidebar__search">
          <Search size={14} className="journal-sidebar__search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search entries…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="journal-sidebar__search-input"
          />
        </div>
        <div className="journal-sidebar__pills" role="group" aria-label="Filter by mode">
          <button
            type="button"
            className={`journal-sidebar__pill ${modeFilter === 'all' ? 'journal-sidebar__pill--active' : ''}`}
            onClick={() => onModeFilter('all')}
          >
            All
          </button>
          {Object.entries(MODE_LABELS).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`journal-sidebar__pill ${modeFilter === id ? 'journal-sidebar__pill--active' : ''}`}
              onClick={() => onModeFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="journal-sidebar__list custom-scrollbar">
        {loading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
        {!loading && filtered.length === 0 && (
          <div className="journal-sidebar__empty">
            <BookOpen size={22} className="journal-sidebar__empty-icon" aria-hidden="true" />
            <p className="journal-sidebar__empty-title">No entries match this view.</p>
            <p className="journal-sidebar__empty-copy">
              Write a note for today, or clear filters to see older entries.
            </p>
          </div>
        )}
        {filtered.map((entry) => {
          const parsed = parseEntry(entry.encrypted_content);
          const active = selectedId === entry.id;
          const analysis = analysisMap[entry.id];
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              className={`journal-sidebar__item${active ? ' is-active' : ''}`}
            >
              <div className="journal-sidebar__item-date">{formatDate(entry.date)}</div>
              <div className="journal-sidebar__item-preview">
                {getEntryPreview(entry.encrypted_content)}
              </div>
              <div className="journal-sidebar__item-tags">
                <span className="journal-sidebar__tag">
                  {MODE_LABELS[parsed.mode] || 'Journal'}
                </span>
                {analysis?.emotionalTone && (
                  <span className="journal-sidebar__tag">{analysis.emotionalTone}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
