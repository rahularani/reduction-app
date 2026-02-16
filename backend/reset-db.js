import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function resetDatabase() {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306')
    });

    console.log('Connected to MySQL');

    // Drop and recreate database
    await connection.query('DROP DATABASE IF EXISTS food_waste_app');
    console.log('Dropped old database');

    await connection.query('CREATE DATABASE food_waste_app');
    console.log('Created new database');

    await connection.end();
    console.log('✅ Database reset successfully!');
    console.log('Now run: npm run dev');
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    process.exit(1);
  }
}

resetDatabase();
