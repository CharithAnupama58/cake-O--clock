import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        jobRole: null,
        branchId: null,
    });

    useEffect(() => {
        
        const storedAuthState = localStorage.getItem('authState');
        if (storedAuthState) {
            setAuthState(JSON.parse(storedAuthState));
        }
    }, []);

    useEffect(() => {
        
        localStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};
