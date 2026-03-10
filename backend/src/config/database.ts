import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import { logger } from '../utils/logger.js'

dotenv.config()

// Determine database dialect (mysql or postgres)
const dbDialect = (process.env.DB_DIALECT || 'mysql') as 'mysql' | 'postgres'
const dbPort = parseInt(process.env.DB_PORT || (dbDialect === 'postgres' ? '5432' : '3306'))

const sequelize = new Sequelize(
  process.env.DB_NAME || 'food_waste_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: dbPort,
    dialect: dbDialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    const dbType = dbDialect === 'postgres' ? 'PostgreSQL' : 'MySQL'
    logger.info(`${dbType} Database connected successfully`)
    
    // Sync all models
    await sequelize.sync({ alter: true })
    logger.info('Database synchronized')
  } catch (error) {
    logger.error('Unable to connect to database:', error)
    process.exit(1)
  }
}

export default sequelize
