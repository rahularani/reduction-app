import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

const PORT = parseInt(process.env.PORT || '5000')

console.log('=== SERVER STARTING ===')
console.log('PORT:', PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)

const app = express()
const httpServer = createServer(app)

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://reduction-app-frontend-yphm.vercel.app',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}))
app.use(express.json())

// Ensure uploads directory exists
const uploadsPath = path.resolve(process.cwd(), 'uploads')
const foodImagesPath = path.join(uploadsPath, 'food-images')

try {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
  }
  if (!fs.existsSync(foodImagesPath)) {
    fs.mkdirSync(foodImagesPath, { recursive: true })
  }
} catch (error) {
  console.error('Failed to create directories:', error)
}

// Serve uploads
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}, express.static(uploadsPath))

// API root endpoint
app.get('/api', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Food Waste Reduction API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      food: '/api/food',
      admin: '/api/admin',
      wasteFoodMarketplace: '/api/waste-food',
      health: '/api/health'
    }
  })
})

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

console.log('Basic setup complete, importing routes...')

// Import routes
import authRoutes from './routes/auth.routes.js'
import foodRoutes from './routes/food.routes.js'
import adminRoutes from './routes/admin.routes.js'
import wasteFoodRoutes from './routes/wastefood.routes.js'
import { initializeSocket } from './socket/socket.js'
import { connectDB } from './config/database.js'
import { startExpirationChecker } from './utils/expirationChecker.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js'

console.log('Routes imported')

// Initialize Socket.IO
try {
  initializeSocket(httpServer)
  console.log('Socket.IO initialized')
} catch (error) {
  console.error('Socket.IO init failed:', error)
}

// Add routes
app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/waste-food', wasteFoodRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

console.log('Routes configured')

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`)
})

// Handle errors
httpServer.on('error', (error: any) => {
  console.error('Server error:', error)
})

// Connect to database in background
console.log('Connecting to database...')
connectDB().then(() => {
  console.log('Database connected')
  startExpirationChecker()
}).catch((error) => {
  console.error('Database connection failed:', error)
})

// Prevent process from exiting
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})

console.log('Server setup complete')
