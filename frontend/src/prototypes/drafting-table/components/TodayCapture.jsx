import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Corners } from './Blueprint';
import { F } from './ui';

/**
 * The capture-first hero on Today. Genesis GOV-106: the day surface leads with
 * the primary act (capture), not a derived dashboard. Type a line → AIIMIN
 * parses it on the Capture surface. Micro-task is the one small commitment.
 */
export default function TodayCapture({ vm }) {
  const [text, setText] = useState('');

  const submit = () => {
    const t = text.trim();
    if (!t) { vm.go('cap'); return; }
    vm.startCapture(t);
    setText('');
  };

  return (
    <div style={{ marginTop: 'var(--space-4)' }}>
      {/* Universal capture composer */}
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', background: 'var(--tint)', padding: 'var(--space-4)' }}>
        <Corners />
        <textarea
          rows={2}
          placeholder="Log anything — AIIMIN sorts it. ‘paid 240 metro, felt sharp 8/10’"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          style={{ font: "400 15px/1.5 Barlow, sans-serif" }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
          <span style={{ ...F.mono(9.5), color: 'var(--muted)' }}>ENTER TO PARSE · AI READS IT</span>
          <button
            className="tap"
            onClick={submit}
            style={{ display: 'flex', alignItems: 'center', gap: 6, font: "600 12px 'Barlow Condensed', sans-serif", letterSpacing: '.1em', color: 'var(--color-bg)', background: 'var(--color-accent)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer' }}
          >
            LOG <ArrowRight size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Micro-task — one small thing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', border: '1px solid var(--hair)', borderTop: 'none', padding: '10px var(--space-4)' }}>
        <span style={{ font: "600 9px 'Barlow Condensed', sans-serif", letterSpacing: '.18em', color: 'var(--muted)', flex: 'none' }}>ONE SMALL THING</span>
        <input
          value={vm.microTask}
          onChange={(e) => vm.setMicroTask(e.target.value)}
          placeholder="the single move that makes today count"
          style={{ flex: 1, font: "400 13px Barlow, sans-serif", color: 'var(--color-text)', background: 'transparent', border: 'none', outline: 'none' }}
        />
      </div>
    </div>
  );
}
