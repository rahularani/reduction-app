import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001', {
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      if (import.meta.env.DEV) {
        console.log('Socket connected:', socket?.id)
      }
    })

    socket.on('disconnect', () => {
      if (import.meta.env.DEV) {
        console.log('Socket disconnected')
      }
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initializeSocket()
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
