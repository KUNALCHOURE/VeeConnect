import { useState } from 'react'

import './App.css'
import { Routes,Route } from 'react-router-dom';
import Landingpage from './pages/landing'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
   <Routes>

    <Route path="/" element={<Landingpage/>}/>

   </Routes>
   
    </>
  )
}

export default App
