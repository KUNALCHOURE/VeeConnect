import axios from 'axios';

const api=axios.create({
    baseURL:"https://veeconnect-1.onrender.com/api/v1",
   // baseURL:"http://localhost:3000/api/v1",
    withCredentials:true
})

export default api;