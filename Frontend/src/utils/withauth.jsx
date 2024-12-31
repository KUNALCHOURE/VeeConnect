import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();

        const isAuthenticated = () => {
            return !!localStorage.getItem("token"); // Return boolean directly
        };

        useEffect(() => {
            if (!isAuthenticated()) {
                navigate("/auth"); // Ensure you call the function
            }
        }, [navigate]);

        return isAuthenticated() ? <WrappedComponent {...props} /> : null; // Render only if authenticated
    };

    return AuthComponent;
};

export default withAuth;
