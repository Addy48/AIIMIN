import React, { useState } from 'react';
import { Corners } from '../components/Blueprint';
import { ScreenHead, SectionRule, PrimaryButton, F } from '../components/ui';

const TEMPLATES = ['FREE WRITE', 'CBT', 'MORNING PAGES', 'WEEKLY REVIEW'];
const MOODS = ['ROUGH', 'OFF', 'OKAY', 'GOOD', 'STRONG']; // 1..5, mono — no emoji, keeps the language

const PROMPTS = {
  'FREE WRITE': 'Write freely. No structure — just the day as it lands.',
  CBT: 'Situation → thought → feeling → evidence → reframe.',
  'MORNING PAGES': 'Three pages, unfiltered, before the day claims you.',
  'WEEKLY REVIEW': 'What worked, what slipped, what one change next week.',
};

export default function Journal({ vm }) {
  const [template, setTemplate] = useState('FREE WRITE');

  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <ScreenHead title="JOURNAL" meta="SUN · 02 AUG" />

      {/* Template selector */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${TEMPLATES.length}, 1fr)`, border: '1px solid var(--hair)', borderRight: 'none', marginTop: 'var(--space-4)' }}>
        {TEMPLATES.map((t) => {
          const on = template === t;
          return (
            <button
              key={t}
              className="tap"
              onClick={() => setTemplate(t)}
              style={{ border: 'none', borderRight: '1px solid var(--hair)', padding: '8px 2px', font: "600 9px 'Barlow Condensed', sans-serif", letterSpacing: '.1em', cursor: 'pointer', background: on ? 'var(--tint)' : 'transparent', color: on ? 'var(--color-accent)' : 'var(--muted)' }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Composer */}
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', background: 'var(--tint)', padding: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        <Corners />
        <textarea
          rows={5}
          placeholder={PROMPTS[template]}
          value={vm.journalDraft}
          onChange={vm.onJournalDraft}
          style={{ font: "400 15px/1.55 Barlow, sans-serif" }}
        />
      </div>

      {/* Mood */}
      <SectionRule label="MOOD" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, marginTop: 'var(--space-3)' }}>
        {MOODS.map((m, i) => {
          const on = vm.journalMood === i + 1;
          return (
            <button
              key={m}
              className="tap"
              onClick={() => vm.setJournalMood(i + 1)}
              style={{ border: `1px solid ${on ? 'var(--color-accent)' : 'var(--hair)'}`, background: on ? 'var(--tint)' : 'transparent', padding: '9px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <span style={{ ...F.mono(13, 700), color: on ? 'var(--color-accent)' : 'var(--color-text)' }}>{i + 1}</span>
              <span style={{ font: "600 8px 'Barlow Condensed', sans-serif", letterSpacing: '.1em', color: on ? 'var(--color-accent)' : 'var(--muted)' }}>{m}</span>
            </button>
          );
        })}
      </div>

      <PrimaryButton onClick={() => vm.saveJournal(template)} style={{ width: '100%', marginTop: 'var(--space-6)' }}>
        SAVE ENTRY
      </PrimaryButton>

      {/* History */}
      <SectionRule label="HISTORY" value={`${vm.journal.length} ENTRIES`} />
      <div style={{ marginTop: 'var(--space-2)' }}>
        {vm.journal.map((e, i) => (
          <div key={i} style={{ padding: '11px 0', borderBottom: i < vm.journal.length - 1 ? '1px solid var(--hair)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ ...F.mono(10.5, 500) }}>{e.date}</span>
              <span style={{ font: "600 8.5px 'Barlow Condensed', sans-serif", letterSpacing: '.12em', color: 'var(--muted)' }}>{e.template}</span>
              <span style={{ marginLeft: 'auto', ...F.mono(10), color: 'var(--color-accent)' }}>MOOD {e.mood}</span>
            </div>
            <div style={{ ...F.body(12.5, 400, 1.45), color: 'var(--muted)', marginTop: 4, textWrap: 'pretty' }}>{e.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
