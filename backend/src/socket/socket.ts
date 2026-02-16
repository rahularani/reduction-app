import { Server } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { logger } from '../utils/logger.js'

let io: Server

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL || 'http://localhost:5173'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    logger.debug('User connected:', socket.id)

    socket.on('disconnect', () => {
      logger.debug('User disconnected:', socket.id)
    })

    socket.on('error', (error) => {
      logger.error('Socket error:', error)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}
