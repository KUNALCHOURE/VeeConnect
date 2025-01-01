import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import the new CSS file

export default function Navbar() {
const navigate=useNavigate();
  let handleclick=()=>{
    navigate("/auth");
  }
  return (
    <div className="navv">
      <nav className="navbar">
        <div className="navheading">
          <h1>Live Video Call</h1>
        </div>
        <div className="navlist">
           <p>Join as guest</p>
           <button className='loginbutton' onClick={handleclick}>Login</button>
        </div>
      </nav>
    </div>
  );
}
