import api from './api.js'

const authsetvice={

    login:async (credentials)=>{
        try{
        const response= await api.post('/user/login',credentials);
         
         return response.data
        }
        catch (error) {
            throw error.response?.data || error.message;
        }
    },

    register:async (credentials)=>{
        try{
            console.log("Attempting registration with credentials:", credentials);
            const response= await api.post('/user/register',credentials);
            console.log("Registration response:", response);
            return response.data;
        }
        catch (error) {
            console.error("Registration error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw error.response?.data || error.message;
        }
    },

    logout:async()=>{
        try {
            console.log("hello");
            const response = await api.post('/auth/logout');
            return response;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
  


};

export default authsetvice;