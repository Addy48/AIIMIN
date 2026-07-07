import React, { useCallback, useState } from 'react';

const STORAGE_KEY = 'aiimin-design-lab-votes';

function readVotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useDesignVotes() {
  const [votes, setVotes] = useState(readVotes);

  const setVote = useCallback((id, value) => {
    setVotes((prev) => {
      const next = { ...prev, [id]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const approved = Object.values(votes).filter((v) => v === 'approve').length;
  const skipped = Object.values(votes).filter((v) => v === 'skip').length;

  return { votes, setVote, approved, skipped, total: Object.keys(votes).length };
}

export default function ApprovalVote({ id, label, votes, setVote }) {
  const current = votes[id];

  return (
    <div className="ui-lab-vote" role="group" aria-label={`Vote on ${label}`}>
      <button
        type="button"
        className={`ui-lab-vote__btn ${current === 'approve' ? 'is-on is-approve' : ''}`}
        onClick={() => setVote(id, current === 'approve' ? null : 'approve')}
      >
        Approve
      </button>
      <button
        type="button"
        className={`ui-lab-vote__btn ${current === 'maybe' ? 'is-on is-maybe' : ''}`}
        onClick={() => setVote(id, current === 'maybe' ? null : 'maybe')}
      >
        Maybe
      </button>
      <button
        type="button"
        className={`ui-lab-vote__btn ${current === 'skip' ? 'is-on is-skip' : ''}`}
        onClick={() => setVote(id, current === 'skip' ? null : 'skip')}
      >
        Skip
      </button>
    </div>
  );
}
