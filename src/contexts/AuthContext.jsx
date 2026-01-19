import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api/auth';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setUserData(user);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email, password, selectedRole = 'farmer') => {
        // Mock success
        const mockUser = {
            id: 'mock-123',
            name: 'Demo User',
            email: email,
            role: selectedRole
        };

        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        setUserData(mockUser);
        return { success: true, user: mockUser };
    };

    const signup = async (name, email, password, role) => {
        // Mock success
        const mockUser = {
            id: 'mock-123',
            name: name,
            email: email,
            role: role
        };

        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        setUserData(mockUser);
        return { success: true, user: mockUser };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setUserData(null);
    };

    const value = {
        currentUser,
        userData,
        isAuthenticated: !!currentUser,
        role: userData?.role,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
