import Apierror from '../../../backend/utils/Apierror.js';
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
        const response= await api.post('/user/register',credentials);
         
         return response.data
        }
        catch (error) {
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