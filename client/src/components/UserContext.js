import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Initialize isAuthenticated based on whether a token exists in localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken'));
    // Optionally store other user information (e.g., token)
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));

    const login = (token) => {
        setIsAuthenticated(true);
        setUserToken(token);
        localStorage.setItem('userToken', token); // Store the token in localStorage for persistence
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserToken('');
        setUser(null); // Clear the user state
        localStorage.removeItem('userToken'); // Clean up token from localStorage
    };

    // Automatically log out the user if the token is removed or invalidated
    useEffect(() => {
        const handleStorageChange = () => {
            if (!localStorage.getItem('userToken')) {
                logout();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, userToken, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
