import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './context/authecontext';
import Videomeetcomponent from './pages/videomeet';
import Homecomponent from './pages/home';
import History from './pages/history';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/auth" element={<Authentication />} />
         <Route path="/:url" element={<Videomeetcomponent/>}/>
         <Route path="/home" element={<Homecomponent/>}/>
         <Route path='/history' element={<History/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
