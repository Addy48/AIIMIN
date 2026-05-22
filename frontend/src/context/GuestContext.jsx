import React, { createContext, useContext, useState } from 'react';

const GuestContext = createContext(null);

export function GuestProvider({ children }) {
  const [isGuest] = useState(true);
  const guestUser = {
    id: 'guest',
    full_name: 'Guest User',
    username: 'GUEST',
    role: 'guest',
    isGuest: true,
  };

  return (
    <GuestContext.Provider value={{ isGuest, guestUser }}>
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => useContext(GuestContext);

export default GuestContext;
