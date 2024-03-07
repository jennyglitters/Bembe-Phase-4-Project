import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken'));
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const login = (token, userId) => {
        setIsAuthenticated(true);
        setUserToken(token);
        setUserId(userId);
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', userId);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserToken(null);
        setUserId(null);
        setUser(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
    };

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
