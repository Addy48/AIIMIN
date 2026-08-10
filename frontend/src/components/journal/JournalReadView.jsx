import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import { MODE_LABELS, parseEntry } from './journalUtils';
import { formatDateLong } from '../../utils/formatDate';

function renderBody(parsed) {
  if (parsed.mode === 'cbt') {
    const fields = parsed.fields || {};
    return [
      ['Situation', fields.situation],
      ['Automatic thought', fields.automaticThought],
      ['Emotion', fields.emotion],
      ['Evidence for', fields.evidenceFor],
      ['Evidence against', fields.evidenceAgainst],
      ['Balanced thought', fields.balancedThought],
    ].filter(([, value]) => value).map(([label, value]) => `${label}\n${value}`).join('\n\n');
  }

  if (parsed.mode === 'www') {
    return (parsed.wins || [])
      .filter((win) => win?.text?.trim() || win?.why?.trim())
      .map((win, idx) => {
        const text = win?.text?.trim() || 'Untitled win';
        const why = win?.why?.trim();
        return `${idx + 1}. ${text}${why ? `\nWhy: ${why}` : ''}`;
      })
      .join('\n\n');
  }

  if (parsed.body) return parsed.body;
  return JSON.stringify(parsed, null, 2);
}

export default function JournalReadView({ entry, onNewEntry }) {
  const c = useThemeColors();
  const parsed = parseEntry(entry?.encrypted_content);
  const label = MODE_LABELS[parsed.mode] || 'Journal';
  const body = renderBody(parsed) || 'Empty entry';

  return (
    <section className="journal-read-view">
      <header className="journal-read-view__header">
        <div>
          <p className="text-label" style={{ margin: 0 }}>Past entry</p>
          <p style={{ margin: '6px 0 0', color: c.text2, fontSize: 14 }}>
            {formatDateLong(entry.date)}
          </p>
          <p style={{ margin: '6px 0 0', color: c.text3, fontSize: 12 }}>{label}</p>
        </div>
        <button
          type="button"
          onClick={onNewEntry}
          style={{
            background: 'none',
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: '6px 12px',
            color: c.text3,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          New entry
        </button>
      </header>
      <article className="journal-read-view__body">{body}</article>
    </section>
  );
}
