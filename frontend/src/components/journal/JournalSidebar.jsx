import React from 'react';
import { motion } from 'framer-motion';
import { Search, Download, BookOpen } from 'lucide-react';
import useThemeColors from '../../hooks/useThemeColors';
import { entryMatchesSearch, getEntryPreview, MODE_LABELS, parseEntry } from './journalUtils';
import { SkeletonRow } from '../ui/Skeleton';

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
  const c = useThemeColors();

  const filtered = entries
    .filter((e) => {
      if (modeFilter === 'all') return true;
      return parseEntry(e.encrypted_content).mode === modeFilter;
    })
    .filter((e) => entryMatchesSearch(e, search))
    .slice(0, 30);

  return (
    <aside style={{
      borderRight: `1px solid ${c.border}`,
      background: c.surface2,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    }}>
      <div style={{ padding: '18px 16px', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span className="text-label">History</span>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: c.text3 }}>Search and revisit past entries.</p>
          </div>
          <button type="button" onClick={onExport} aria-label="Export journal" style={{ background: c.surface3, border: `1px solid ${c.border}`, borderRadius: 8, color: c.text3, cursor: 'pointer', padding: 7, display: 'inline-flex' }}>
            <Download size={16} />
          </button>
        </div>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: c.text3 }} />
          <input
            type="text"
            placeholder="Search entries…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: '100%', padding: '11px 12px 11px 36px', borderRadius: 10, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1, fontSize: 13 }}
          />
        </div>
        <div className="journal-sidebar__pills">
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 24px' }}>
        {loading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ margin: '18px 4px', padding: 18, border: `1px dashed ${c.borderLit}`, borderRadius: 14, background: c.surface1, textAlign: 'center' }}>
            <BookOpen size={22} style={{ color: c.accent, marginBottom: 10 }} />
            <p style={{ margin: 0, color: c.text1, fontSize: 13, fontWeight: 750 }}>No entries match this view.</p>
            <p style={{ margin: '6px 0 0', color: c.text3, fontSize: 12, lineHeight: 1.45 }}>
              Write today&apos;s note or clear your filters to bring older reflections back.
            </p>
          </div>
        )}
        {filtered.map((entry) => {
          const parsed = parseEntry(entry.encrypted_content);
          const active = selectedId === entry.id;
          const analysis = analysisMap[entry.id];
          return (
            <motion.button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: 12,
                marginBottom: 8,
                borderRadius: 12,
                border: active ? `1px solid ${c.borderLit}` : `1px solid ${c.border}`,
                background: active ? c.surface1 : c.surface3,
                cursor: 'pointer',
                transition: 'background var(--dur-normal) var(--ease), border-color var(--dur-normal) var(--ease), transform var(--dur-fast) var(--ease)',
              }}
            >
              <div style={{ fontSize: 12, color: c.text3, marginBottom: 4 }}>{entry.date}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.text1, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getEntryPreview(entry.encrypted_content)}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: c.surface4, color: c.text2 }}>
                  {MODE_LABELS[parsed.mode] || 'Journal'}
                </span>
                {analysis?.emotionalTone && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: c.surface4, color: c.text2 }}>
                    {analysis.emotionalTone}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
