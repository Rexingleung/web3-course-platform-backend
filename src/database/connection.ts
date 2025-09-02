import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '&*&Ddasd123.ii2',
  database: process.env.DB_NAME || 'web3',
};

let connection: mysql.Connection;

export async function initializeDatabase() {
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

async function createTables() {
  const createCoursesTable = `
    CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      author VARCHAR(42) NOT NULL,
      price DECIMAL(20, 0) NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_course_id (course_id),
      INDEX idx_author (author)
    )
  `;

  const createPurchasesTable = `
    CREATE TABLE IF NOT EXISTS purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT NOT NULL,
      buyer VARCHAR(42) NOT NULL,
      price DECIMAL(20, 0) NOT NULL,
      transaction_hash VARCHAR(66),
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_course_buyer (course_id, buyer),
      INDEX idx_buyer (buyer)
    )
  `;

  try {
    await connection.execute(createCoursesTable);
    await connection.execute(createPurchasesTable);
    console.log('Database tables created/verified');
  } catch (error) {
    console.error('Failed to create tables:', error);
    throw error;
  }
}

export function getConnection() {
  if (!connection) {
    throw new Error('Database not initialized');
  }
  return connection;
}
