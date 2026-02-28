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
const PORT = process.env.PORT || 5000

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

// Connect to DB and start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
    logger.info('Socket.IO initialized')
    
    // Start the food expiration checker
    startExpirationChecker()
  })
})
