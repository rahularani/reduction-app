import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { createServer } from 'http'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.routes.js'
import foodRoutes from './routes/food.routes.js'
import adminRoutes from './routes/admin.routes.js'
import wasteFoodRoutes from './routes/wastefood.routes.js'
import { initializeSocket } from './socket/socket.js'
import { startExpirationChecker } from './utils/expirationChecker.js'
import { logger } from './utils/logger.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = parseInt(process.env.PORT || '5000')

// Initialize Socket.IO
initializeSocket(httpServer)

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}))
app.use(express.json())

// Serve uploaded images with proper headers
const uploadsPath = path.resolve(process.cwd(), 'uploads')
logger.info('Serving uploads from:', uploadsPath)

app.use('/uploads', (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}, express.static(uploadsPath))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/waste-food', wasteFoodRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Error handling middleware (must be last)
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js'
app.use(notFoundHandler)
app.use(errorHandler)

// Start server immediately (don't wait for DB)
httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server listening on port ${PORT}`)
  logger.info('Socket.IO initialized')
})

// Handle server errors
httpServer.on('error', (error: any) => {
  logger.error('Server error:', error)
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`)
  }
  process.exit(1)
})

// Connect to DB in background
connectDB().then(() => {
  logger.info('Database connected successfully')
  startExpirationChecker()
}).catch((error) => {
  logger.error('Database connection failed:', error)
  logger.warn('Server running without database - API calls will fail')
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason)
})
