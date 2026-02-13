import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.routes.js'
import foodRoutes from './routes/food.routes.js'
import { initializeSocket } from './socket/socket.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

// Initialize Socket.IO
initializeSocket(httpServer)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}))
app.use(express.json())

// Serve uploaded images with proper headers
const uploadsPath = path.resolve(process.cwd(), 'uploads')
console.log('Serving uploads from:', uploadsPath)

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}, express.static(uploadsPath))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Connect to DB and start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Socket.IO initialized`)
  })
})
