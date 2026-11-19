
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import validator from 'validator'
import userModel from '../models/userModel.js'

// Configuration Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

// Recherche du compte utilisateur
const findUserByEmail = async (email) => {
    const escapedEmail = email.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    )

    return userModel.findOne({
        email: {
            $regex: `^${escapedEmail}$`,
            $options: 'i'
        }
    })
}

// 1. Envoyer un lien de réinitialisation
const forgotPassword = async (req, res) => {
    try {
        const email = String(req.body.email || '')
            .trim()
            .toLowerCase()

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            })
        }

        const message =
            'If an account exists, a reset link will be sent.'

        const user = await findUserByEmail(email)

        // Ne pas révéler si le compte existe
        if (!user) {
            return res.json({
                success: true,
                message
            })
        }

        // Générer un token sécurisé
        const token = crypto.randomBytes(32)
            .toString('hex')

        // Conserver seulement le hash du token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        user.resetPasswordToken = hashedToken

        // Expiration après 15 minutes
        user.resetPasswordExpires =
            new Date(Date.now() + 15 * 60 * 1000)

        await user.save()

        const resetUrl =
            `${process.env.FRONTEND_URL}/forgot-password?token=${token}`

        try {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'Reset Your Password - Forever',
                text: `
Hello,

We received a request to reset your password.

Click the following link:

${resetUrl}

This link expires in 15 minutes.

If you did not request this change, ignore this email.

Forever Team
                `
            })
        } catch (mailError) {
            user.resetPasswordToken = null
            user.resetPasswordExpires = null
            await user.save()
            throw mailError
        }

        return res.json({
            success: true,
            message
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'Unable to process your request'
        })
    }
}

// 2. Enregistrer le nouveau mot de passe
const resetPassword = async (req, res) => {
    try {
        const {
            email,
            token,
            newPassword,
            confirmPassword
        } = req.body

        const normalizedEmail = String(email || '')
            .trim()
            .toLowerCase()

        if (
            !validator.isEmail(normalizedEmail) ||
            typeof token !== 'string' ||
            !/^[a-f0-9]{64}$/i.test(token)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reset request'
            })
        }

        if (
            typeof newPassword !== 'string' ||
            newPassword.length < 8
        ) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least 8 characters'
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            })
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        const user = await findUserByEmail(normalizedEmail)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset link'
            })
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        )

        // Mise à jour atomique et token à usage unique
        const updatedUser = await userModel.findOneAndUpdate(
            {
                _id: user._id,
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    $gt: new Date()
                }
            },
            {
                $set: {
                    password: hashedPassword
                },
                $unset: {
                    resetPasswordToken: '',
                    resetPasswordExpires: ''
                }
            },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset link'
            })
        }

        return res.json({
            success: true,
            message: 'Password reset successfully!'
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'Unable to reset password'
        })
    }
}

export { forgotPassword, resetPassword }
