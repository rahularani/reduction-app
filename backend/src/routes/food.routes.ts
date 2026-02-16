import express from 'express'
import Food from '../models/Food.model.js'
import User from '../models/User.model.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'
import { getIO } from '../socket/socket.js'
import { calculateExpirationDate } from '../utils/expirationChecker.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

router.post('/create', authenticate, authorize('donor'), upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { foodType, quantity, freshnessDuration, pickupLocation, latitude, longitude } = req.body

    const imageUrl = req.file ? `/uploads/food-images/${req.file.filename}` : undefined

    // Calculate expiration date
    const freshnessExpiresAt = calculateExpirationDate(freshnessDuration)

    const food = await Food.create({
      donorId: parseInt(req.userId!),
      foodType,
      quantity,
      freshnessDuration,
      freshnessExpiresAt,
      pickupLocation,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      imageUrl
    })

    // Get donor info for the socket event
    const foodWithDonor = await Food.findByPk(food.id, {
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email']
        }
      ]
    })

    // Emit socket event to all volunteers
    const io = getIO()
    io.emit('newFoodPost', foodWithDonor)

    res.status(201).json(food)
  } catch (error) {
    logger.error('Create food error:', error)
    res.status(500).json({ message: 'Failed to create food post' })
  }
})

router.get('/my-posts', authenticate, authorize('donor'), async (req: AuthRequest, res) => {
  try {
    const posts = await Food.findAll({
      where: { 
        donorId: parseInt(req.userId!),
        status: ['available', 'claimed', 'completed'] // Exclude expired
      },
      include: [
        {
          model: User,
          as: 'claimedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(posts)
  } catch (error) {
    logger.error('Fetch posts error:', error)
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
})

router.get('/available', authenticate, authorize('volunteer'), async (_req: AuthRequest, res) => {
  try {
    const posts = await Food.findAll({
      where: { status: 'available' },
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(posts)
  } catch (error) {
    logger.error('Fetch available food error:', error)
    res.status(500).json({ message: 'Failed to fetch available food' })
  }
})

router.get('/my-claims', authenticate, authorize('volunteer'), async (req: AuthRequest, res) => {
  try {
    const posts = await Food.findAll({
      where: { 
        claimedById: parseInt(req.userId!),
        status: ['claimed', 'completed']
      },
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(posts)
  } catch (error) {
    logger.error('Fetch claimed food error:', error)
    res.status(500).json({ message: 'Failed to fetch claimed food' })
  }
})

router.post('/claim/:id', authenticate, authorize('volunteer'), async (req: AuthRequest, res): Promise<void> => {
  try {
    const food = await Food.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name']
        }
      ]
    })
    
    if (!food) {
      res.status(404).json({ message: 'Food not found' })
      return
    }

    if (food.status !== 'available') {
      res.status(400).json({ message: 'Food already claimed' })
      return
    }

    const otp = generateOTP()
    food.status = 'claimed'
    food.claimedById = parseInt(req.userId!)
    food.otp = otp

    await food.save()

    // Get volunteer info
    const volunteer = await User.findByPk(req.userId!, {
      attributes: ['id', 'name', 'email']
    })

    // Emit socket event to update all clients
    const io = getIO()
    io.emit('foodClaimed', { 
      foodId: food.id,
      donorId: food.donorId,
      volunteer: volunteer,
      status: 'claimed'
    })

    res.json({
      _id: food.id,
      foodType: food.foodType,
      pickupLocation: food.pickupLocation,
      latitude: food.latitude,
      longitude: food.longitude,
      otp,
      donor: (food as any).donor
    })
  } catch (error) {
    logger.error('Claim food error:', error)
    res.status(500).json({ message: 'Failed to claim food' })
  }
})

router.post('/verify-otp/:id', authenticate, authorize('donor'), async (req: AuthRequest, res): Promise<void> => {
  try {
    const { otp } = req.body
    const food = await Food.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'claimedBy',
          attributes: ['id', 'name']
        }
      ]
    })

    if (!food) {
      res.status(404).json({ message: 'Food not found' })
      return
    }

    if (food.donorId !== parseInt(req.userId!)) {
      res.status(403).json({ message: 'Not authorized' })
      return
    }

    if (food.status !== 'claimed') {
      res.status(400).json({ message: 'Food not in claimed status' })
      return
    }

    if (food.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' })
      return
    }

    // Mark as completed
    food.status = 'completed'
    await food.save()

    // Emit socket event
    const io = getIO()
    io.emit('foodCompleted', { 
      foodId: food.id,
      donorId: food.donorId
    })

    res.json({ 
      message: 'Delivery completed successfully',
      food: {
        id: food.id,
        status: food.status,
        volunteer: (food as any).claimedBy
      }
    })
  } catch (error) {
    logger.error('Verify OTP error:', error)
    res.status(500).json({ message: 'Failed to verify OTP' })
  }
})

export default router
