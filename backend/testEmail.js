
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

const testEmail = async () => {
  try {
    // Vérifier la connexion Gmail SMTP
    await transporter.verify()

    console.log('SMTP connection successful!')

    // Envoyer un e-mail de test
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Ecommerce Clothing - Email Test',
      text: 'Hello! Your Nodemailer configuration is working successfully.'
    })

    console.log('Email sent successfully!')
    console.log('Message ID:', info.messageId)

  } catch (error) {
    console.error('Email error:', error.message)
  }
}

testEmail()
