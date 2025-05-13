import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './components/pages/landing.jsx';
import Authentication from './components/pages/authentication.jsx';
import { AuthProvider } from './context/authecontext.jsx';
import Videomeetcomponent from './components/pages/Videomeet.jsx';
import Homecomponent from './components/pages/home.jsx';
import Navbar from './components/layout/Navbar.jsx';
import { useState } from 'react';
import Footer from './components/layout/Footer.jsx';
import Profile from './components/pages/Profile.jsx';

function App() {
  const[inmeeting,setinmeeting]=useState(false);
  return (
    <AuthProvider>
      {!inmeeting &&  <Navbar/>}
     
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/home" element={<Homecomponent/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/meeting" element={<Videomeetcomponent setinmeeting={setinmeeting}/>}/>
        <Route path="/meeting/:url" element={<Videomeetcomponent setinmeeting={setinmeeting}/>}/>
      </Routes>
      {!inmeeting &&  <Footer/>}
    </AuthProvider>
  );
}

export default App;
