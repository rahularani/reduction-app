import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_waste_app'
  })

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    await connection.execute(
      'INSERT INTO users (name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Admin User', 'admin@foodwaste.com', hashedPassword, 'admin']
    )

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@foodwaste.com')
    console.log('🔑 Password: admin123')
    console.log('\n⚠️  Please change the password after first login!')
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Admin user already exists')
    } else {
      console.error('❌ Error creating admin:', error.message)
    }
  } finally {
    await connection.end()
  }
}

createAdmin()
