import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axiosConfig from '../api/axiosConfig' // Adjust path based on your folder structure

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: {
          firstName: data.firstName,
          lastName: data.lastName
        },
        email: data.email,
        password: data.password
      }

      
      const response = await axiosConfig.post('/auth/register', payload)

      if (response.status === 201) {
        navigate('/')
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white  ">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="John"
              />
              {errors.firstName && <span className="text-red-400 text-xs">{String(errors?.firstName.message)}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Doe"
              />
              {errors.lastName && <span className="text-red-400 text-xs">{String(errors.lastName.message)}</span>}
            </div>
          </div>

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
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-400 text-xs">{String(errors.password.message)}</span>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition duration-200 rounded-lg font-semibold text-white shadow-md"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}