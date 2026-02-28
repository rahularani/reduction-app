import express from 'express'
import WasteFood from '../models/WasteFood.model.js'
import User from '../models/User.model.js'
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'
import { getIO } from '../socket/socket.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// Create waste food listing (for donors/sellers)
router.post('/create', authenticate, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { foodType, quantity, price, description, pickupLocation, latitude, longitude } = req.body

    const imageUrl = req.file ? `/uploads/food-images/${req.file.filename}` : undefined

    const wasteFood = await WasteFood.create({
      sellerId: parseInt(req.userId!),
      foodType,
      quantity,
      price: parseFloat(price),
      description,
      pickupLocation,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      imageUrl
    })

    const wasteFoodWithSeller = await WasteFood.findByPk(wasteFood.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }
      ]
    })

    // Emit socket event to all farmers
    const io = getIO()
    io.emit('newWasteFoodPost', wasteFoodWithSeller)

    res.status(201).json(wasteFood)
  } catch (error) {
    logger.error('Create waste food error:', error)
    res.status(500).json({ message: 'Failed to create waste food listing' })
  }
})

// Get all available waste food (for farmers/buyers)
router.get('/available', authenticate, async (_req: AuthRequest, res) => {
  try {
    const posts = await WasteFood.findAll({
      where: { status: 'available' },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(posts)
  } catch (error) {
    logger.error('Fetch available waste food error:', error)
    res.status(500).json({ message: 'Failed to fetch available waste food' })
  }
})

// Get seller's listings
router.get('/my-listings', authenticate, async (req: AuthRequest, res) => {
  try {
    const posts = await WasteFood.findAll({
      where: { 
        sellerId: parseInt(req.userId!),
        status: ['available', 'reserved', 'sold']
      },
      include: [
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
    logger.error('Fetch listings error:', error)
    res.status(500).json({ message: 'Failed to fetch listings' })
  }
})

// Get buyer's purchases
router.get('/my-purchases', authenticate, async (req: AuthRequest, res) => {
  try {
    const posts = await WasteFood.findAll({
      where: { 
        buyerId: parseInt(req.userId!),
        status: ['reserved', 'sold']
      },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(posts)
  } catch (error) {
    logger.error('Fetch purchases error:', error)
    res.status(500).json({ message: 'Failed to fetch purchases' })
  }
})

// Buy/Reserve waste food
router.post('/buy/:id', authenticate, async (req: AuthRequest, res): Promise<void> => {
  try {
    const wasteFood = await WasteFood.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }
      ]
    })
    
    if (!wasteFood) {
      res.status(404).json({ message: 'Waste food not found' })
      return
    }

    if (wasteFood.status !== 'available') {
      res.status(400).json({ message: 'Already sold or reserved' })
      return
    }

    wasteFood.status = 'reserved'
    wasteFood.buyerId = parseInt(req.userId!)
    await wasteFood.save()

    const buyer = await User.findByPk(req.userId!, {
      attributes: ['id', 'name', 'email']
    })

    // Emit socket event
    const io = getIO()
    io.emit('wasteFoodReserved', { 
      wasteFoodId: wasteFood.id,
      sellerId: wasteFood.sellerId,
      buyer: buyer,
      status: 'reserved'
    })

    res.json({
      message: 'Successfully reserved',
      wasteFood: {
        id: wasteFood.id,
        foodType: wasteFood.foodType,
        price: wasteFood.price,
        pickupLocation: wasteFood.pickupLocation,
        seller: (wasteFood as any).seller
      }
    })
  } catch (error) {
    logger.error('Buy waste food error:', error)
    res.status(500).json({ message: 'Failed to reserve waste food' })
  }
})

// Mark as sold/completed
router.post('/complete/:id', authenticate, async (req: AuthRequest, res): Promise<void> => {
  try {
    const wasteFood = await WasteFood.findByPk(req.params.id)

    if (!wasteFood) {
      res.status(404).json({ message: 'Waste food not found' })
      return
    }

    if (wasteFood.sellerId !== parseInt(req.userId!)) {
      res.status(403).json({ message: 'Not authorized' })
      return
    }

    if (wasteFood.status !== 'reserved') {
      res.status(400).json({ message: 'Not in reserved status' })
      return
    }

    wasteFood.status = 'sold'
    await wasteFood.save()

    // Emit socket event
    const io = getIO()
    io.emit('wasteFoodSold', { 
      wasteFoodId: wasteFood.id,
      sellerId: wasteFood.sellerId
    })

    res.json({ 
      message: 'Transaction completed successfully',
      wasteFood: {
        id: wasteFood.id,
        status: wasteFood.status
      }
    })
  } catch (error) {
    logger.error('Complete transaction error:', error)
    res.status(500).json({ message: 'Failed to complete transaction' })
  }
})

export default router
