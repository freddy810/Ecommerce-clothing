
import express from 'express'

import {
    loginUser,
    registerUser,
    adminLogin,
    checkUserEmail
} from '../controllers/userController.js'

import {
    forgotPassword,
    resetPassword
} from '../controllers/resetPasswordController.js'

const userRouter = express.Router()

// Authentification existante
userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.post('/admin', adminLogin)

// Vérification Subscribe ajoutée précédemment
userRouter.post('/check-email', checkUserEmail)

// Mot de passe oublié
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

export default userRouter
