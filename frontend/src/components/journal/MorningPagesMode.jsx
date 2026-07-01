import React from 'react';
import JournalWriteCanvas from './JournalWriteCanvas';
import { getMorningWindowStatus } from './journalUtils';

export default function MorningPagesMode({
  onSave,
  todayEntry = null,
  readOnly = false,
  initialBody = '',
  initialMood = 6,
}) {
  const windowStatus = getMorningWindowStatus();
  const body = todayEntry?.body || initialBody || '';
  const mood = todayEntry?.meta?.mood || initialMood;
  const nudgeText = windowStatus === 'ideal'
    ? ''
    : 'Morning Pages works best between 6am and 9am, but you can still write now.';

  return (
    <JournalWriteCanvas
      onSave={onSave}
      readOnly={readOnly}
      initialBody={body}
      initialMood={mood}
      nudgeText={nudgeText}
      prompt="Three pages if you can. Empty your mind before the day gets noisy."
      saveLabel="Save morning pages"
    />
  );
}
