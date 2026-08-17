import React, { useState } from 'react';
import BrandMark from '../components/BrandMark';
import { Corners } from '../components/Blueprint';
import { PrimaryButton, GhostButton, F } from '../components/ui';
import { MIN_LABELS } from '../data';

const STEPS = 6;

// Shared chrome for every onboarding step.
function Frame({ step, kicker, title, children, footer }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
        <BrandMark size={22} />
        <span style={{ font: "600 13px 'Barlow Condensed', sans-serif", letterSpacing: '.28em', textTransform: 'uppercase' }}>AIIMIN</span>
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 'var(--space-6)' }}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <i key={i} style={{ flex: 1, height: 3, background: i < step ? 'var(--color-accent)' : 'var(--hair)', display: 'block', transition: 'background 220ms' }} />
        ))}
      </div>
      <div style={{ ...F.mono(10), letterSpacing: '.16em', color: 'var(--muted)', marginTop: 'var(--space-3)' }}>
        STEP {String(step).padStart(2, '0')} / 0{STEPS} · {kicker}
      </div>
      <div style={{ font: "600 32px/1.05 'Barlow Condensed', sans-serif", marginTop: 'var(--space-3)', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ marginTop: 'var(--space-4)' }}>{children}</div>
      <div style={{ flex: 1 }} />
      {footer}
    </div>
  );
}

export default function Onboarding({ vm }) {
  const [step, setStep] = useState(1);
  const [arc, setArc] = useState('');
  const [picked, setPicked] = useState([true, true, true, false, false]);
  const [firstCap, setFirstCap] = useState('');
  const next = () => setStep((s) => Math.min(STEPS, s + 1));
  const pickedCount = picked.filter(Boolean).length;

  // 1 — Welcome
  if (step === 1) {
    return (
      <Frame step={1} kicker="WELCOME" title={<>One screen.<br />Every day.</>}
        footer={<PrimaryButton onClick={next} style={{ width: '100%', fontSize: 14, padding: 14 }}>BEGIN</PrimaryButton>}>
        <div style={{ ...F.body(14, 400, 1.55), color: 'var(--muted)', textWrap: 'pretty' }}>
          Your habits, money, focus and mood — one calm operating system. Capture through the week on the phone; the site opens the full drawing on Sunday.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-8) 0 var(--space-4)' }}>
          <BrandMark size={96} tile />
        </div>
      </Frame>
    );
  }

  // 2 — Auth (visual only in the prototype)
  if (step === 2) {
    return (
      <Frame step={2} kicker="SIGN IN" title="Your identity"
        footer={
          <div>
            <PrimaryButton onClick={next} style={{ width: '100%', fontSize: 14, padding: 14 }}>CONTINUE</PrimaryButton>
            <div style={{ textAlign: 'center', ...F.mono(9.5), color: 'var(--muted)', marginTop: 'var(--space-2)' }}>OS-ID + PIN OR GOOGLE · NEVER SHARED</div>
          </div>
        }>
        <div style={{ ...F.body(13.5, 400, 1.5), color: 'var(--muted)', textWrap: 'pretty' }}>
          Sign in with your 8-character OS-ID or continue with Google. Testers are approved by invite.
        </div>
        <div style={{ border: '1px solid var(--hair)', padding: 'var(--space-3) var(--space-4)', marginTop: 'var(--space-6)', ...F.mono(13), color: 'var(--muted)' }}>8-char OS-ID or email</div>
        <div style={{ border: '1px solid var(--hair)', borderTop: 'none', padding: 'var(--space-3) var(--space-4)', ...F.mono(13), color: 'var(--muted)' }}>PIN ● ● ● ● ● ●</div>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <GhostButton style={{ width: '100%', color: 'var(--color-text)' }}>CONTINUE WITH GOOGLE</GhostButton>
        </div>
      </Frame>
    );
  }

  // 3 — Claim OS-ID
  if (step === 3) {
    return (
      <Frame step={3} kicker="CLAIM" title="Claim your OS-ID"
        footer={
          <div>
            <PrimaryButton onClick={next} style={{ width: '100%', fontSize: 14, padding: 14 }}>CLAIM {vm.chosenId}</PrimaryButton>
            <div style={{ textAlign: 'center', ...F.mono(9.5), color: 'var(--muted)', marginTop: 'var(--space-2)' }}>ONE REVISION PERMITTED, LATER</div>
          </div>
        }>
        <div style={{ ...F.body(13.5, 400, 1.5), color: 'var(--muted)', textWrap: 'pretty' }}>
          Eight characters, yours permanently — on the app, on aiimin.in, on anything AIIMIN builds next.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', border: '1px solid var(--rule)', borderRight: 'none', marginTop: 'var(--space-6)' }}>
          {vm.idCells.map((k, i) => (
            <span key={i} style={{ borderRight: '1px solid var(--rule)', aspectRatio: '1 / 1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 20px 'JetBrains Mono', monospace", color: k.fg }}>{k.ch}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...F.mono(10), color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
          <span style={{ color: 'var(--color-accent)' }}>✓ AVAILABLE</span><span>8/8 CHARS · 3/4 DIGITS</span>
        </div>
        <div style={{ display: 'flex', gap: 5, marginTop: 'var(--space-4)' }}>
          {vm.alts.map((a, i) => (
            <span key={i} className="tap" onClick={a.pick} style={{ ...F.mono(12, 500), padding: '7px 10px', cursor: 'pointer', border: `1px solid ${a.edge}`, color: a.fg }}>{a.id}</span>
          ))}
        </div>
      </Frame>
    );
  }

  // 4 — Set Arc
  if (step === 4) {
    return (
      <Frame step={4} kicker="DIRECTION" title="Set your arc"
        footer={<PrimaryButton onClick={next} style={{ width: '100%', fontSize: 14, padding: 14 }}>SET DIRECTION</PrimaryButton>}>
        <div style={{ ...F.body(13.5, 400, 1.5), color: 'var(--muted)', textWrap: 'pretty' }}>
          One line for where your story is headed. The OS aligns your day and week to it.
        </div>
        <div style={{ position: 'relative', border: '1px solid var(--color-accent)', background: 'var(--tint)', padding: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
          <Corners />
          <input value={arc} onChange={(e) => setArc(e.target.value)} placeholder="Crack placements · be healthier than last year · ship the side project"
            style={{ width: '100%', font: "400 15px Barlow, sans-serif", color: 'var(--color-text)', background: 'transparent', border: 'none', outline: 'none' }} />
        </div>
        <div style={{ ...F.mono(9.5), color: 'var(--muted)', marginTop: 'var(--space-3)', letterSpacing: '.1em' }}>LATER: DAILY ARC · WEEKLY ARC · LIFE ARC</div>
      </Frame>
    );
  }

  // 5 — Pick minimums
  if (step === 5) {
    return (
      <Frame step={5} kicker="COMMIT" title="Your daily minimums"
        footer={<PrimaryButton onClick={next} style={{ width: '100%', fontSize: 14, padding: 14 }}>LOCK {pickedCount} MINIMUMS</PrimaryButton>}>
        <div style={{ ...F.body(13.5, 400, 1.5), color: 'var(--muted)', textWrap: 'pretty' }}>
          The non-negotiables. Tick a few — the day clears when these are done.
        </div>
        <div style={{ marginTop: 'var(--space-4)' }}>
          {MIN_LABELS.map((label, i) => (
            <div key={i} className="tap" onClick={() => setPicked((p) => p.map((v, j) => (j === i ? !v : v)))}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '11px 0', borderBottom: '1px solid var(--hair)', cursor: 'pointer' }}>
              <span style={{ width: 18, height: 18, flex: 'none', display: 'block', border: `1px solid ${picked[i] ? 'var(--color-accent)' : 'var(--rule)'}`, background: picked[i] ? 'var(--color-accent)' : 'transparent' }} />
              <span style={{ ...F.body(13.5), color: picked[i] ? 'var(--color-text)' : 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  // 6 — First capture
  return (
    <Frame step={6} kicker="FIRST LOG" title="Log your first thing"
      footer={
        <PrimaryButton onClick={() => { vm.claimId(); }} style={{ width: '100%', fontSize: 14, padding: 14 }}>
          SETTLE & ENTER AIIMIN
        </PrimaryButton>
      }>
      <div style={{ ...F.body(13.5, 400, 1.5), color: 'var(--muted)', textWrap: 'pretty' }}>
        Write anything — AIIMIN reads it and offers a structure. This is the whole loop, once.
      </div>
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', background: 'var(--tint)', padding: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        <Corners />
        <textarea rows={3} value={firstCap} onChange={(e) => setFirstCap(e.target.value)}
          placeholder="paid 240 metro, walked 25 min, felt sharp 8/10"
          style={{ font: "400 15px/1.5 Barlow, sans-serif" }} />
      </div>
      {firstCap.trim() && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'var(--space-3)' }}>
          {['₹240', 'Transport', 'Walk 25m', 'Mood 8'].map((c) => (
            <span key={c} style={{ font: "500 11.5px Barlow, sans-serif", padding: '5px 9px', border: '1px solid var(--color-accent)', background: 'var(--color-accent)', color: 'var(--color-bg)' }}>{c}</span>
          ))}
        </div>
      )}
    </Frame>
  );
}
