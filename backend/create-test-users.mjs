import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

async function createTestUsers() {
  console.log('🔧 Creating test users...\n')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_waste_app',
    port: parseInt(process.env.DB_PORT || '3306')
  })

  try {
    const testUsers = [
      { name: 'Test Donor', email: 'donor@test.com', password: 'test123', role: 'donor' },
      { name: 'Test Volunteer', email: 'volunteer@test.com', password: 'test123', role: 'volunteer' },
      { name: 'Test Farmer', email: 'farmer@test.com', password: 'test123', role: 'farmer' }
    ]

    for (const user of testUsers) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await connection.execute(
          'INSERT INTO users (name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [user.name, user.email, hashedPassword, user.role]
        )
        console.log(`✅ ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} user created`)
        console.log(`   📧 Email: ${user.email}`)
        console.log(`   🔑 Password: ${user.password}\n`)
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} user already exists`)
          console.log(`   📧 Email: ${user.email}\n`)
        } else {
          throw error
        }
      }
    }

    console.log('✅ Test users setup complete!\n')
  } catch (error) {
    console.error('❌ Error creating test users:', error.message)
  } finally {
    await connection.end()
  }
}

createTestUsers()
