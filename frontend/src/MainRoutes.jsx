import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Register from "./Pages/Register"
import Login from "./Pages/Login"


const MainRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
    </Routes>
  )
}

export default MainRoutes