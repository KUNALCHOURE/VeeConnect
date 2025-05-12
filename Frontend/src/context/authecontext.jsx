// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authservice from '../utils/authservice.js'; // Correct import with lowercase 's'
import { toast } from 'react-hot-toast';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        try {
            const data = await authservice.login(credentials);
            setUser(data.data.user);
            toast.success('Welcome back!');
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log("Inside register function in AuthContext", userData);
            const response = await authservice.register(userData);
            console.log("User registered successfully", response);
            if (!response || !response.data || !response.data.user) {
                throw new Error("Invalid response from the server");
            }
            setUser(response.data.user);
            
            toast.success(welcomeMessage);
            return response.data;
        } catch (error) {
            console.error("Error during registration:", error);
            const errorMessage = error?.message || error?.response?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
            throw new Error(errorMessage);
            
            
        }
    };

    const logout = async () => {
        try {
            await authservice.logout();
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Error logging out');
            throw error;
        }
    };

    const isHotelLister = () => {
        return user?.role === 'hotel_lister';
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/user/current-user");
                if (response.data.data.userobject) {
                    setUser(response.data.data.userobject);
                }
                console.log("User object:", response.data.data.userobject);
                user = response.data.data.userobject;
                console.log(user);
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                login, 
                logout, 
                register, 
                loading,
                isHotelLister
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};