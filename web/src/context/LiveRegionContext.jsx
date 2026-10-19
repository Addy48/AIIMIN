import React, { createContext, useCallback, useContext, useState } from 'react';
import LiveRegion from '../components/ui/LiveRegion';

const LiveRegionContext = createContext({ announce: () => {} });

export function LiveRegionProvider({ children }) {
  const [message, setMessage] = useState('');

  const announce = useCallback((text) => {
    if (!text) return;
    setMessage('');
    requestAnimationFrame(() => setMessage(text));
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      <LiveRegion message={message} />
      {children}
    </LiveRegionContext.Provider>
  );
}

export function useAnnounce() {
  return useContext(LiveRegionContext).announce;
}
