
import React, { useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const ForgotPassword = () => {

    const { backendUrl, navigate } = useContext(ShopContext)

    const [searchParams] = useSearchParams()

    // Jeton reçu par e-mail
    const resetToken = searchParams.get('token')

    const isResetMode = Boolean(resetToken)

    // États du formulaire
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // ================================
    // SEND RESET LINK
    // ================================

    const handleForgotPassword = async (event) => {
        event.preventDefault()

        if (loading) return

        try {
            setLoading(true)

            const response = await axios.post(
                `${backendUrl}/api/user/forgot-password`,
                {
                    email: email.trim().toLowerCase()
                }
            )

            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {

            console.error(error)

            toast.error(
                error.response?.data?.message ||
                'Unable to send reset link'
            )

        } finally {
            setLoading(false)
        }
    }

    // ================================
    // RESET PASSWORD
    // ================================

    const handleResetPassword = async (event) => {
        event.preventDefault()

        if (loading) return

        if (newPassword.length < 8) {
            toast.error(
                'Password must contain at least 8 characters'
            )
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            setLoading(true)

            const response = await axios.post(
                `${backendUrl}/api/user/reset-password`,
                {
                    email: email.trim().toLowerCase(),
                    token: resetToken,
                    newPassword,
                    confirmPassword
                }
            )

            if (response.data.success) {

                toast.success('Password reset successfully!')

                setNewPassword('')
                setConfirmPassword('')

                // Retour à la connexion
                navigate('/login', { replace: true })

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {

            console.error(error)

            toast.error(
                error.response?.data?.message ||
                'Invalid or expired reset link'
            )

        } finally {
            setLoading(false)
        }
    }

    // ================================
    // FORM
    // ================================

    return (

        <form
            onSubmit={
                isResetMode
                    ? handleResetPassword
                    : handleForgotPassword
            }
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >

            {/* TITLE */}

            <div className="inline-flex items-center gap-2 mb-2 mt-10">

                <p className="prata-regular text-3xl">

                    {isResetMode
                        ? 'Reset Password'
                        : 'Forgot Password'}

                </p>

                <hr className="border-none h-[1.5px] w-8 bg-gray-800" />

            </div>

            {/* DESCRIPTION */}

            <p className="text-gray-500 text-sm text-center">

                {isResetMode
                    ? 'Enter your email and create a new password.'
                    : 'Enter your email to receive a password reset link.'}

            </p>

            {/* EMAIL */}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-800"
                autoComplete="email"
                required
            />

            {/* PASSWORD FIELDS */}

            {isResetMode && (

                <>

                    {/* NEW PASSWORD */}

                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-800"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    {/* CONFIRM PASSWORD */}

                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-800"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    {/* SHOW PASSWORD */}

                    <div className="w-full flex items-center gap-2">

                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={(e) =>
                                setShowPassword(e.target.checked)
                            }
                        />

                        <label
                            htmlFor="showPassword"
                            className="text-sm cursor-pointer"
                        >
                            Show Passwords
                        </label>

                    </div>

                    {/* PASSWORD VALIDATION */}

                    {confirmPassword &&
                        newPassword !== confirmPassword && (

                            <p className="text-red-500 text-sm w-full">
                                Passwords do not match
                            </p>

                        )}

                </>

            )}

            {/* BACK TO LOGIN */}

            <div className="w-full flex justify-end">

                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-sm hover:underline"
                >
                    Back to Login
                </button>

            </div>

            {/* SUBMIT BUTTON */}

            <button
                type="submit"
                disabled={
                    loading ||
                    (
                        isResetMode &&
                        (
                            newPassword.length < 8 ||
                            newPassword !== confirmPassword
                        )
                    )
                }
                className="bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-50"
            >

                {loading
                    ? 'PLEASE WAIT...'
                    : isResetMode
                        ? 'RESET PASSWORD'
                        : 'SEND RESET LINK'}

            </button>

        </form>

    )
}

export default ForgotPassword
