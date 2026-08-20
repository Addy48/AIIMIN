// Drafting Table — live score model (placeholder curve from the handoff).
// round(70.7 + minimumsDone*1.9 + (rung-3)*1.6 + (railAverage-70)*0.12)

export function computeScore(mins, rails, rung) {
  const done = mins.filter(Boolean).length;
  const railAvg = rails.reduce((a, b) => a + b, 0) / rails.length;
  return Math.round(70.7 + done * 1.9 + (rung - 3) * 1.6 + (railAvg - 70) * 0.12);
}

export function scoreDelta(score) {
  return (score >= 78 ? '+' : '') + (score - 78);
}

export function scoreBand(score) {
  if (score >= 85) return 'excellent (85+)';
  if (score >= 70) return 'strong (70–84)';
  return 'fair (55–69)';
}

export function minsLabel(mins) {
  const done = mins.filter(Boolean).length;
  return '0' + done + '/05';
}

export function minsPenalty(mins) {
  const done = mins.filter(Boolean).length;
  return done === 5 ? '+0.9' : '−' + ((5 - done) * 0.35).toFixed(1);
}
