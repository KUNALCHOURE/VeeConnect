import React, { createContext, useState } from 'react';
import httpStatus from 'http-status';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:3000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState();
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const request = await client.post("/register", { name, username, password });
            if (request.status === httpStatus.CREATED) {
                console.log("registered");
                router("/home");
                return request.data.message;
            }
        } catch (error) {
            throw error;
        }
    };

    const handlelogin = async (username, password) => {
        try {
            const request = await client.post("/login", { username, password });
            if (request.status === httpStatus.OK) {
                console.log("logged in");
                localStorage.setItem("token", request.data.token);
                router("/home",);
                return request.data.message;
            }
        } catch (error) {
            throw error;
        }
    };

    const gethisotryofuser = async () => {
        try {
            const req = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token"),
                },
            });
            console.log(req);
            return req.data;
            
        } catch (error) {
            throw error;
        }
    };

    const addtouserhistory = async (meetingcode) => {
        try {
            const request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingcode,
            });
            return request;
        } catch (error) {
            throw error;
        }
    };

    const data = {
        userData,
        setUserData,
        addtouserhistory,
        gethisotryofuser,
        handleRegister,
        handlelogin,
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
