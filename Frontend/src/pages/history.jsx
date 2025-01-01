import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../layout/navbar'
import {IconButton } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History';
import { AuthContext } from '../context/authecontext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
export default function History() {
let navigate=useNavigate();

    const {gethisotryofuser}=useContext(AuthContext);
    const[meeting,setmeeting]=useState([]);

    useEffect(()=>{
      const fetchhistory=async()=>{
        console.log("called");
        try {
            let his=await gethisotryofuser();
            setmeeting(his);
            console.log("called2");
            console.log(his);
            
        } catch (error) {
            
        }
      }
      fetchhistory();
 

    },[])

    let handlehome =()=>{
    navigate("/home");
    }
  return (
    <>
     <div className="navv">
      <nav className="navbar">
        <div className="navheading">
          <h1 style={{color:"black"}}>Live Video Call</h1>
        </div>
        <div className="navlist">
          <div className="history" style={{display:"flex"}}>
          <IconButton onClick={handlehome}>
              <HistoryIcon></HistoryIcon>
              <p>Home</p>
          </IconButton>
         
        
          </div>
          
        </div>
      </nav>
    </div>

    <div className="historyofuser">
      {meeting.map((meet,i)=>{
          <Card key={i}  sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              History
            </Typography>
            <Typography variant="h5" component="div">
              {meet.user_id}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
            <Typography variant="body2">
            {meet.meeting_id}
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      })  
   
}
    </div>

    
    </>
  )
}
