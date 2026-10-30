import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'main_dbs',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true,
});

pool.getConnection()
  .then((conn) => {
    console.log(`✅ Successfully connected to MySQL database: ${process.env.DB_DATABASE} at ${process.env.DB_HOST}`);
    conn.release();
  })
  .catch((err) => {
    console.error(`❌ MySQL connection failed to ${process.env.DB_HOST}:`, err.message);
  });

export function getDbPool() {
  return pool;
}

