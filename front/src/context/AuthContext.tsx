import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import axiosInstance from '../axiosInstance';
import { AuthResponse } from '../types/AuthResponse';
import axios from 'axios';
import { AuthContextType } from '../types/AuthContextType';
import { LoginRequest } from '../types/LoginRequest';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponse | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const navigate = useNavigate();
    
    const login = useCallback(async (credentials: LoginRequest) => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
            const userData = response.data;
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (userData.role === 'ADMIN') {
                navigate('/statistiques');
            } else if (userData.role === 'PROFESSOR') {
                navigate('/prof-modules');
            }
            return userData;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to login');
            }
            throw new Error('Network error occurred');
        }
    }, []);
    
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate]);
    
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
