import express from 'express'
import User from '../models/User.model.js'
import Food from '../models/Food.model.js'
import WasteFood from '../models/WasteFood.model.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// Get all users
router.get('/users', authenticate, authorize('admin'), async (_req: AuthRequest, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    })
    res.json(users)
  } catch (error) {
    logger.error('Fetch users error:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// Get all food posts
router.get('/food-posts', authenticate, authorize('admin'), async (_req: AuthRequest, res) => {
  try {
    const posts = await Food.findAll({
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email']
        },
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
    logger.error('Fetch food posts error:', error)
    res.status(500).json({ message: 'Failed to fetch food posts' })
  }
})

// Get dashboard statistics
router.get('/stats', authenticate, authorize('admin'), async (_req: AuthRequest, res) => {
  try {
    const totalUsers = await User.count()
    const totalDonors = await User.count({ where: { role: 'donor' } })
    const totalVolunteers = await User.count({ where: { role: 'volunteer' } })
    const totalFarmers = await User.count({ where: { role: 'farmer' } })
    const totalFoodPosts = await Food.count()
    const availableFood = await Food.count({ where: { status: 'available' } })
    const claimedFood = await Food.count({ where: { status: 'claimed' } })
    const completedFood = await Food.count({ where: { status: 'completed' } })
    const totalWasteFoodPosts = await WasteFood.count()
    const availableWasteFood = await WasteFood.count({ where: { status: 'available' } })
    const reservedWasteFood = await WasteFood.count({ where: { status: 'reserved' } })
    const soldWasteFood = await WasteFood.count({ where: { status: 'sold' } })

    res.json({
      totalUsers,
      totalDonors,
      totalVolunteers,
      totalFarmers,
      totalFoodPosts,
      availableFood,
      claimedFood,
      completedFood,
      totalWasteFoodPosts,
      availableWasteFood,
      reservedWasteFood,
      soldWasteFood
    })
  } catch (error) {
    logger.error('Fetch stats error:', error)
    res.status(500).json({ message: 'Failed to fetch statistics' })
  }
})

// Delete user
router.delete('/users/:id', authenticate, authorize('admin'), async (req: AuthRequest, res): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id)
    
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (user.role === 'admin') {
      res.status(403).json({ message: 'Cannot delete admin users' })
      return
    }

    await user.destroy()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    logger.error('Delete user error:', error)
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

// Delete food post
router.delete('/food-posts/:id', authenticate, authorize('admin'), async (req: AuthRequest, res): Promise<void> => {
  try {
    const food = await Food.findByPk(req.params.id)
    
    if (!food) {
      res.status(404).json({ message: 'Food post not found' })
      return
    }

    await food.destroy()
    res.json({ message: 'Food post deleted successfully' })
  } catch (error) {
    logger.error('Delete food post error:', error)
    res.status(500).json({ message: 'Failed to delete food post' })
  }
})

// Get all waste food posts
router.get('/waste-food-posts', authenticate, authorize('admin'), async (_req: AuthRequest, res) => {
  try {
    const posts = await WasteFood.findAll({
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(posts)
  } catch (error) {
    logger.error('Fetch waste food posts error:', error)
    res.status(500).json({ message: 'Failed to fetch waste food posts' })
  }
})

// Delete waste food post
router.delete('/waste-food-posts/:id', authenticate, authorize('admin'), async (req: AuthRequest, res): Promise<void> => {
  try {
    const wasteFood = await WasteFood.findByPk(req.params.id)
    
    if (!wasteFood) {
      res.status(404).json({ message: 'Waste food post not found' })
      return
    }

    await wasteFood.destroy()
    res.json({ message: 'Waste food post deleted successfully' })
  } catch (error) {
    logger.error('Delete waste food post error:', error)
    res.status(500).json({ message: 'Failed to delete waste food post' })
  }
})

export default router
