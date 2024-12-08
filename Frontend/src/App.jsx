import { useState } from 'react'

import './App.css'
import { Routes,Route } from 'react-router-dom';
import Landingpage from './pages/landing'
import Authentication from './pages/authentication';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
   <Routes>

    <Route path="/" element={<Landingpage/>}/>
    <Route path='/auth' element={<Authentication/>}/>
   </Routes>
   
   
    </>
  )
}

export default App
