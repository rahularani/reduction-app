import Food from '../models/Food.model.js'
import { Op } from 'sequelize'

// Parse freshness duration string to hours
const parseDurationToHours = (duration: string): number => {
  const match = duration.match(/(\d+)\s*(hour|hours|hr|hrs|h)/i)
  if (match) {
    return parseInt(match[1])
  }
  return 24 // Default to 24 hours if can't parse
}

// Calculate expiration date from freshness duration
export const calculateExpirationDate = (freshnessDuration: string, createdAt: Date = new Date()): Date => {
  const hours = parseDurationToHours(freshnessDuration)
  const expirationDate = new Date(createdAt)
  expirationDate.setHours(expirationDate.getHours() + hours)
  return expirationDate
}

// Check and mark expired food posts
export const checkExpiredPosts = async () => {
  try {
    const now = new Date()
    
    // Find all available posts that have expired
    const expiredPosts = await Food.findAll({
      where: {
        status: 'available',
        freshnessExpiresAt: {
          [Op.lte]: now
        }
      }
    })

    if (expiredPosts.length > 0) {
      // Mark them as expired
      await Food.update(
        { status: 'expired' },
        {
          where: {
            id: expiredPosts.map(post => post.id)
          }
        }
      )

      console.log(`✅ Marked ${expiredPosts.length} food post(s) as expired`)
    }
  } catch (error) {
    console.error('❌ Error checking expired posts:', error)
  }
}

// Start the expiration checker (runs every 5 minutes)
export const startExpirationChecker = () => {
  // Run immediately on start
  checkExpiredPosts()
  
  // Then run every 5 minutes
  setInterval(checkExpiredPosts, 5 * 60 * 1000)
  
  console.log('🕐 Food expiration checker started (runs every 5 minutes)')
}
