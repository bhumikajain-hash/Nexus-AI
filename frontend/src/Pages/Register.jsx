// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux' // 1. Import useDispatch
// import { setUser } from '../redux/reducer/chatSlice' // 2. Import setUser action
// import toast from 'react-hot-toast'
// import axiosConfig from '../api/axiosConfig'

// export default function Register() {
//   const { register, handleSubmit, formState: { errors } } = useForm()
//   const navigate = useNavigate()
//   const dispatch = useDispatch() // 3. Initialize dispatch
//   const [loading, setLoading] = useState(false)

//   const onSubmit = async (data) => {
//     setLoading(true)
//     const toastId = toast.loading('Creating your account...')

//     try {
//       const payload = {
//         fullName: {
//           firstName: data.firstName,
//           lastName: data.lastName
//         },
//         email: data.email,
//         password: data.password
//       }

//       const response = await axiosConfig.post('/auth/register', payload)

//       if (response.status === 201 || response.status === 200) {
//         // 4. Update Redux store instantly with the new user data
//         const userData = response.data.user;
//         dispatch(setUser({
//           name: `${userData.fullName.firstName} ${userData.fullName.lastName || ''}`,
//           email: userData.email,
//           id: userData.id || userData._id
//         }))

//         toast.success('Account created successfully!', { id: toastId })
//         navigate('/')
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
//       toast.error(errorMessage, { id: toastId })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center text-white px-4 bg-[#0f172a]">
//       <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
//         <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">Create Account</h2>
        
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">First Name</label>
//               <input
//                 type="text"
//                 {...register('firstName', { required: 'First name is required' })}
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
//                 placeholder="John"
//               />
//               {errors.firstName && <span className="text-red-400 text-xs mt-1 block">{String(errors.firstName.message)}</span>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Last Name</label>
//               <input
//                 type="text"
//                 {...register('lastName', { required: 'Last name is required' })}
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
//                 placeholder="Doe"
//               />
//               {errors.lastName && <span className="text-red-400 text-xs mt-1 block">{String(errors.lastName.message)}</span>}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input
//               type="email"
//               {...register('email', { required: 'Email is required' })}
//               className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
//               placeholder="john@example.com"
//             />
//             {errors.email && <span className="text-red-400 text-xs mt-1 block">{String(errors.email.message)}</span>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Password</label>
//             <input
//               type="password"
//               {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
//               className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
//               placeholder="••••••••"
//             />
//             {errors.password && <span className="text-red-400 text-xs mt-1 block">{String(errors.password.message)}</span>}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition duration-200 rounded-lg font-semibold text-white shadow-md flex items-center justify-center"
//           >
//             {loading ? 'Creating Account...' : 'Register'}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-400 mt-4">
//           Already have an account?{' '}
//           <Link to="/login" className="text-indigo-400 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/reducer/chatSlice'
import toast from 'react-hot-toast'
import axiosConfig from '../api/axiosConfig'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    const toastId = toast.loading('Creating your account...')

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

      if (response.status === 201 || response.status === 200) {
        const userData = response.data.user;
        dispatch(setUser({
          name: `${userData.fullName.firstName} ${userData.fullName.lastName || ''}`,
          email: userData.email,
          id: userData.id || userData._id
        }))

        toast.success('Account created successfully!', { id: toastId })
        navigate('/')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMessage, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 py-6 bg-[#0f172a]">
      <div className="max-w-md w-full bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-indigo-400">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-white"
                placeholder="John"
              />
              {errors.firstName && <span className="text-red-400 text-xs mt-1 block">{String(errors.firstName.message)}</span>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-3.5 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-white"
                placeholder="Doe"
              />
              {errors.lastName && <span className="text-red-400 text-xs mt-1 block">{String(errors.lastName.message)}</span>}
            </div>
          </div>

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
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs md:text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}