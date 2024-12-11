import React, { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

  const server_url="http:://localhost:8000";
var connections={};

const peerconfigconnnections={
  "iceServers":[
    {"urls":"stun:stun.l.google.com:19302"}
  ] 
}

export default function Videomeetcomponent(){

   var socketRef=useRef();
   let socketIdRef=useRef();
   let localVideoRef=useRef();

   let [videoAvailable,setVideoAvailable]=useState(true);
   let[audioAvailabel,setaudioavailable]=useState(true);

   let[video,setVideo]=useState();
   let[audio,setAudio]=useState();
   let[screen,setscreen]=useState();

  let[showmodel,setmodel]=useState();
  let[screenAvailable,setscreenAvailable]=useState();

  let[messages,setmessages]=useState([]);
  let[message,setmessage]=useState([]);
  let[newMessages,setnewMessages]=useState(0);

  let[askforusername,setaskforusername]=useState(true);
  let[username,setusername]=useState("");

  let[videos,setvideos]=useState([]);


const getpermission=async()=>{

  try {
    
  const videopermission=navigator.mediaDevices.getUserMedia({video:true})
  if(videopermission){
    setVideoAvailable(true);
  }
  else{
    setVideoAvailable(false)
  }

  const audiopermission=navigator.mediaDevices.getUserMedia({ audio:true})
  if(audiopermission){
    setaudioavailable(true);
  }
  else{
    setaudioavailable(false)
  }

  if(navigator.mediaDevices.getDisplayMedia){
    setscreenAvailable(true);
  }
  else{
    setscreenAvailable(false);
  }
  } catch (error) {
  
  }
}

useEffect(()=>{
  getpermission();
},[])

    return(
        <div>

           {askforusername===true?
           <div>
             <h2>Enter into lobby </h2>
             {username}
             <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e)=>setusername(e.target.value)}   />
             <Button variant="contained">Connect </Button>



            <div>
              <video ref={localVideoRef} autoPlay muted></video>
    
            </div>
           </div> 
          :<>
          
          
          </>
          } 
        </div>
    )
  }