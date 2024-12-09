import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landingpage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './context/authecontext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
