import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Restaurar la función original
    const isAuthenticated = () => {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;