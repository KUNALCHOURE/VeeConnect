import React, { createContext, useState } from 'react';
import httpStatus from 'http-status';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  // Initializing user data state
  const [userData, setUserData] = useState(null);
  const router = useNavigate();
  // Register handler
  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name: name,
        username: username,
        password: password
      });

      if (request.status === httpStatus.CREATED) {
        console.log("registered");
        return request.data.message;
        
      }
    } catch (error) {
      throw error;
    }
  };



  const handlelogin=async(username,password)=>{
    try {
       const request=await client.post("/login",{
          username:username,
          password:password,
       })
       if(request.status===httpStatus.OK){
        console.log("logged in");
        localStorage.setItem("token",request.data.token);
        router("/");
        return request.data.message;
       

       }
    } catch (error) {
      throw error;
    }

  }
  

  const data = {
    userData,
    setUserData,
    handleRegister,
    handlelogin
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};
