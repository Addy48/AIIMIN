import React, { createContext, useContext, useState } from 'react';
import AuthContext from './AuthContext';

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
      <AuthContext.Provider value={{ user: guestUser, session: null, loading: false }}>
        {children}
      </AuthContext.Provider>
    </GuestContext.Provider>
  );
}

export const useGuest = () => useContext(GuestContext);

export default GuestContext;
