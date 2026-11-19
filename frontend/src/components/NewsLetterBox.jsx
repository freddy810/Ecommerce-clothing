
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const NewsLetterBox = () => {

  const { backendUrl, navigate } = useContext(ShopContext)

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        `${backendUrl}/api/user/check-email`,
        { email: normalizedEmail }
      )

      if (!response.data.success) {
        toast.error(
          response.data.message || 'Unable to verify email'
        )
        return
      }

      if (response.data.exists) {

        toast.info('You are already registered!')

      } else {

        toast.success('Please create your account!')

        navigate('/login', {
          state: {
            mode: 'Sign Up',
            email: normalizedEmail
          }
        })

        window.scrollTo(0, 0)
      }

    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
        'Unable to verify email. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center">

      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>

      <p className="text-gray-400 mt-3">
        Get 20% off your first order when you sign up
        to our newsletter
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-xs px-10 py-4 disabled:opacity-50"
        >
          {loading ? 'CHECKING...' : 'SUBSCRIBE'}
        </button>

      </form>

    </div>
  )
}

export default NewsLetterBox
