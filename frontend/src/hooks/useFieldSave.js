import { useState, useCallback } from 'react';

/**
 * Inline field save states: idle | saving | saved | error
 */
export default function useFieldSave(saveFn) {
  const [status, setStatus] = useState('idle');

  const save = useCallback(async (value) => {
    setStatus('saving');
    try {
      await saveFn(value);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [saveFn]);

  return { status, save };
}

export function FieldSaveIndicator({ status }) {
  if (status === 'saved') {
    return (
      <span style={{ fontSize: '12px', color: 'var(--color-success)', marginLeft: '8px' }}>
        Saved.
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginLeft: '8px' }}>
        Something went wrong. Try again.
      </span>
    );
  }
  if (status === 'saving') {
    return (
      <span style={{ fontSize: '12px', color: 'var(--color-text-3)', marginLeft: '8px' }}>
        Saving…
      </span>
    );
  }
  return null;
}
