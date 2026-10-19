import React, { useCallback, useState } from 'react';

const STORAGE_KEY = 'aiimin-design-lab-votes';

function readVotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
  } catch {
    return {};
  }
}

export function useDesignVotes() {
  const [votes, setVotes] = useState(readVotes);

  const setVote = useCallback((id, value) => {
    setVotes((prev) => {
      const base = (prev && typeof prev === 'object' && !Array.isArray(prev)) ? prev : {};
      const next = { ...base, [id]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save votes:', e);
      }
      return next;
    });
  }, []);

  const safeVotes = (votes && typeof votes === 'object' && !Array.isArray(votes)) ? votes : {};
  const approved = Object.values(safeVotes).filter((v) => v === 'approve').length;
  const skipped = Object.values(safeVotes).filter((v) => v === 'skip').length;

  return { votes: safeVotes, setVote, approved, skipped, total: Object.keys(safeVotes).length };
}

export default function ApprovalVote({ id, label, votes = {}, setVote }) {
  const current = votes?.[id];

  return (
    <div className="ui-lab-vote" role="group" aria-label={`Vote on ${label || id || 'item'}`}>
      <button
        type="button"
        className={`ui-lab-vote__btn ${current === 'approve' ? 'is-on is-approve' : ''}`}
        onClick={() => setVote?.(id, current === 'approve' ? null : 'approve')}
      >
        Approve
      </button>
      <button
        type="button"
        className={`ui-lab-vote__btn ${current === 'maybe' ? 'is-on is-maybe' : ''}`}
        onClick={() => setVote?.(id, current === 'maybe' ? null : 'maybe')}
      >
        Maybe
      </button>
      <button
        type="button"
        className={`ui-lab-vote__btn ${current === 'skip' ? 'is-on is-skip' : ''}`}
        onClick={() => setVote?.(id, current === 'skip' ? null : 'skip')}
      >
        Skip
      </button>
    </div>
  );
}
