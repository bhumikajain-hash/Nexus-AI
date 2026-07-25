import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const submitHandler = ()=>{
    navigate("/Register")
  }
  return (
    <div>Home
      <br />
      <button onClick={submitHandler} className="bg-red-800 p-4">Create Account</button>
    </div>
  )
}

export default Home