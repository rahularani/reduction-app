import express from 'express'
import User from '../models/User.model.js'
import Food from '../models/Food.model.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware.js'

const router = express.Router()

// Get all users
router.get('/users', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    })
    res.json(users)
  } catch (error) {
    console.error('Fetch users error:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// Get all food posts
router.get('/food-posts', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
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
    console.error('Fetch food posts error:', error)
    res.status(500).json({ message: 'Failed to fetch food posts' })
  }
})

// Get dashboard statistics
router.get('/stats', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const totalUsers = await User.count()
    const totalDonors = await User.count({ where: { role: 'donor' } })
    const totalVolunteers = await User.count({ where: { role: 'volunteer' } })
    const totalFoodPosts = await Food.count()
    const availableFood = await Food.count({ where: { status: 'available' } })
    const claimedFood = await Food.count({ where: { status: 'claimed' } })
    const completedFood = await Food.count({ where: { status: 'completed' } })

    res.json({
      totalUsers,
      totalDonors,
      totalVolunteers,
      totalFoodPosts,
      availableFood,
      claimedFood,
      completedFood
    })
  } catch (error) {
    console.error('Fetch stats error:', error)
    res.status(500).json({ message: 'Failed to fetch statistics' })
  }
})

// Delete user
router.delete('/users/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' })
    }

    await user.destroy()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

// Delete food post
router.delete('/food-posts/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const food = await Food.findByPk(req.params.id)
    
    if (!food) {
      return res.status(404).json({ message: 'Food post not found' })
    }

    await food.destroy()
    res.json({ message: 'Food post deleted successfully' })
  } catch (error) {
    console.error('Delete food post error:', error)
    res.status(500).json({ message: 'Failed to delete food post' })
  }
})

export default router
