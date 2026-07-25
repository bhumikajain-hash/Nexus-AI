import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axiosConfig from '../api/axiosConfig' // Adjust path based on your folder structure

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      // Update the endpoint route to match your backend router setup
      const response = await axiosConfig.post('/auth/login', data)

      if (response.status === 200) {
        navigate('/')
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Welcome Back</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="john@example.com"
            />
            {errors.email && <span className="text-red-400 text-xs">{String(errors.email.message)}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-400 text-xs">{String(errors.password.message)}</span>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition duration-200 rounded-lg font-semibold text-white shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}