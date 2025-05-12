import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './components/pages/landing';
import Authentication from './components/pages/authentication';
import { AuthProvider } from './context/authecontext';
import Videomeetcomponent from './components/pages/videomeet';
import Homecomponent from './components/pages/home';
import Navbar from './components/layout/Navbar';
import { useState } from 'react';
import Footer from './components/layout/Footer';
import Profile from './components/pages/Profile';

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
