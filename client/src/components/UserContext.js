//UserContext
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Initialize isAuthenticated based on whether a token exists in localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken'));
    // Optionally store other user information (e.g., token)
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const login = (token,userId) => {
        setIsAuthenticated(true);
        setUserToken(token);
        setUserId(userId);UserId(userId);UserId(userId);
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', userId);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserToken('');
        setUserId('null');
        setUser(null); // Clear the user state
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId'); // Clean up token from localStorage
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
        <UserContext.Provider value={{ user, setUser, isAuthenticated, userToken, userId, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
