import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// Check if we're in production and have a DATABASE_URL (PostgreSQL)
const isProduction = process.env.NODE_ENV === 'production'
const databaseUrl = process.env.DATABASE_URL

let sequelize: Sequelize

if (isProduction && databaseUrl) {
  // Production: Use PostgreSQL from Render
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
} else {
  // Development: Use MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'food_waste_app',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  )
}

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    const dbType = isProduction && databaseUrl ? 'PostgreSQL' : 'MySQL'
    console.log(`${dbType} Database connected successfully`)
    
    // Sync all models
    await sequelize.sync({ alter: true })
    console.log('Database synchronized')
  } catch (error) {
    console.error('Unable to connect to database:', error)
    process.exit(1)
  }
}

export default sequelize
