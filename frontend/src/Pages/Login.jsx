import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/reducer/chatSlice'
import toast from 'react-hot-toast'
import axiosConfig from '../api/axiosConfig'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    const toastId = toast.loading('Logging in...')

    try {
      const response = await axiosConfig.post('/auth/login', data)

      if (response.status === 200) {
        const userData = response.data.user;
        dispatch(setUser({
          name: userData.fullName?.firstName ? `${userData.fullName.firstName} ${userData.fullName.lastName || ''}` : (userData.name || 'User'),
          email: userData.email,
          id: userData.id || userData._id
        }))

        toast.success('Successfully logged in!', { id: toastId })
        navigate('/')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 py-6 bg-[#0f172a]">
      <div className="max-w-md w-full bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-indigo-400">Welcome Back</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-white"
              placeholder="john@example.com"
            />
            {errors.email && <span className="text-red-400 text-xs mt-1 block">{String(errors.email.message)}</span>}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-white"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-400 text-xs mt-1 block">{String(errors.password.message)}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition duration-200 rounded-xl font-semibold text-sm md:text-base text-white shadow-md flex items-center justify-center mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs md:text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}