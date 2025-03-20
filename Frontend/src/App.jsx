import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './components/pages/landing';
import Authentication from './components/pages/authentication';
import { AuthProvider } from './context/authecontext';
import Videomeetcomponent from './components/pages/videomeet';
import Homecomponent from './components/pages/home';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/auth" element={<Authentication />} />
         <Route path="/:url" element={<Videomeetcomponent/>}/>
         <Route path="/home" element={<Homecomponent/>}/>

      </Routes>
    </AuthProvider>
  );
}

export default App;
