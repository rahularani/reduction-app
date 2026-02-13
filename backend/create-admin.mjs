import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

async function createAdmin() {
  console.log('🔧 Creating admin user...\n')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_waste_app',
    port: parseInt(process.env.DB_PORT || '3306')
  })

  try {
    // Hash the password
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Insert admin user
    await connection.execute(
      'INSERT INTO users (name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Admin User', 'admin@foodwaste.com', hashedPassword, 'admin']
    )

    console.log('✅ Admin user created successfully!\n')
    console.log('📧 Email: admin@foodwaste.com')
    console.log('🔑 Password: admin123')
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!\n')
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Admin user already exists\n')
      console.log('📧 Email: admin@foodwaste.com')
      console.log('🔑 Password: admin123 (if not changed)\n')
    } else {
      console.error('❌ Error creating admin:', error.message)
      console.error('\nPlease check your database connection settings in backend/.env')
    }
  } finally {
    await connection.end()
  }
}

createAdmin()
