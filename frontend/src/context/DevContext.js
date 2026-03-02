import React, { createContext, useContext, useState } from 'react';

const DevContext = createContext(null);

export function DevContextProvider({ children }) {
    const [testDate, setTestDate] = useState(null);

    return (
        <DevContext.Provider value={{ testDate, setTestDate }}>
            {children}
        </DevContext.Provider>
    );
}

export function useDevContext() {
    const context = useContext(DevContext);
    if (!context) {
        throw new Error('useDevContext must be used within a DevContextProvider');
    }
    return context;
}
