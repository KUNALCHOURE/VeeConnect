import React from 'react'
import '../App.css'
export default function Navbar() {
  return (
    <div className='navv ' >
      <nav style={{display:'flex' ,flexDirection:'row',justifyContent:'space-between'}} >
        <div className="heading ">
          <h1 style={{color:'white'}}>live App</h1>
        </div>
        <div className="options" style={{display:'flex' ,flexDirection:'row'}}>
          <div className="login" style={{marginRight:'25px'}}>
            <button>Login</button>
          </div>

          <div className="signup" style={{marginRight:'25px'}}>
            <button>signup</button>
          </div>

        
        </div>
      </nav>
    </div>
  )
}
