import React from 'react'
import "../App.css"
import Navbar from '../layout/navbar'
import { Link } from 'react-router-dom';

export default function Landingpage() {
  return (
    <>
    <div className='landingpagecontainer'>
    <Navbar/>
      <div className="landingmaincontent">
        <div >
            <h1> <span style={{color:'orange'}}>Connect</span> with your  <br />Loved Ones </h1>

            <p>Cover a Distance by  video call </p>
            
            <button ><Link to={"/home"} style={{textDecoration:'none'}}>Get started</Link> </button>
        </div>

        <div className='images'>
            <img src="/mobile.png" alt="" srcset="" className='image'/>

        </div>
      </div>
    </div>
    </>
  )
}
