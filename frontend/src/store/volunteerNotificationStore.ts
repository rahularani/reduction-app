import { create } from 'zustand'

export interface VolunteerNotification {
  id: string
  message: string
  type: 'newFood' | 'completed'
  foodId: number
  foodType?: string
  donorName?: string
  timestamp: Date
  read: boolean
}

interface VolunteerNotificationState {
  notifications: VolunteerNotification[]
  unreadCount: number
  addNotification: (notification: Omit<VolunteerNotification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useVolunteerNotificationStore = create<VolunteerNotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => {
    const newNotification: VolunteerNotification = {
      ...notification,
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      read: false
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1
    }))
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }))
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0
    }))
  },
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 })
  }
}))
