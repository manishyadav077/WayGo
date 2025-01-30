import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CaptainSignup from './pages/CaptainSignup'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>
      </Routes>
    </div>
  )
}

export default App
