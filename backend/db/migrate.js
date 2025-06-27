const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate(){
    // DBへのconnectionを繋ぐ
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.nextTick.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    
    // TABLEの作成
    await connection.execute(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          occupation VARCHAR(255),
          gender ENUM('male', 'female', 'other'),
          date_of_birth DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    );

    console.log('User table migrated successfully');
    connection.end()
}

// 上記処理を実行
migrate();

