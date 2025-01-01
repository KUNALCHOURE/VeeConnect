import React, { useContext, useState } from 'react'
import withAuth from '../utils/withauth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/navbar';
import { Button, IconButton, TextField } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import '../styles/home.css'
import { AuthContext } from '../context/authecontext';

 function Homecomponent() {
let navigate=useNavigate();
const [meetingcode,setmeetingcode]=useState("");
const {addtouserhistory}=useContext(AuthContext);



  let handlejoincall=async()=>{
    await addtouserhistory(meetingcode)
    navigate(`/${meetingcode}`);
     
  }

 
  return (
   <>
   <div className="navv">
      <nav className="navbar">
        <div className="navheading">
          <h1 style={{color:"black"}}>Live Video Call</h1>
        </div>
        
      </nav>
    </div>
    
    <div className="meet">
        <div className="left">
          <h2>Providing Quality video calls </h2>
         <div className="meetingcode">
          <h2>Meeting code:</h2>
          <TextField variant='outlined' value={meetingcode} onChange={(e)=>{setmeetingcode(e.target.value)}}></TextField>
           <Button onClick={handlejoincall}>Join</Button>
          </div>
        </div>

        <div className="right">
          <img src="/mobile.png" alt="" />
        </div>
    </div>


   
   
   </>
  )
}

export default withAuth(Homecomponent);