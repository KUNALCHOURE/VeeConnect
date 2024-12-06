import React from 'react';
// Import the new CSS file

export default function Navbar() {
  return (
    <div className="navv">
      <nav className="navbar">
        <div className="navheading">
          <h1>live App</h1>
        </div>
        <div className="navlist">
           <p>Join as guest</p>
           <p>Register</p>
           <button className='loginbutton'>Login</button>
        </div>
      </nav>
    </div>
  );
}
