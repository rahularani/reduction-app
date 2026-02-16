import express from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.model.js'
import { logger } from '../utils/logger.js'

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }

    await User.create({ name, email, password, role })

    res.status(201).json({ message: 'Registration successful' })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Google OAuth Login
router.post('/google', async (req, res): Promise<void> => {
  try {
    const { credential, role } = req.body

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      res.status(400).json({ message: 'Invalid Google token' })
      return
    }

    // Check if user exists
    let user = await User.findOne({ where: { email: payload.email } })

    if (!user) {
      // Create new user with Google info
      user = await User.create({
        name: (payload.name || payload.email.split('@')[0]) as string,
        email: payload.email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Random password for OAuth users
        role: role || 'donor' // Use provided role or default to donor
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    logger.error('Google auth error:', error)
    res.status(500).json({ message: 'Google authentication failed' })
  }
})

export default router
