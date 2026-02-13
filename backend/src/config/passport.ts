import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.model.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ where: { email: profile.emails?.[0].value } })

        if (user) {
          // User exists, return user
          return done(null, user)
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value || '',
          password: Math.random().toString(36).slice(-8), // Random password for OAuth users
          role: 'donor' // Default role, can be changed later
        })

        return done(null, user)
      } catch (error) {
        return done(error as Error, undefined)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export default passport
