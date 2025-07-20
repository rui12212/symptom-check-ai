// DB操作。emailでUserを探す＋UserをCreateする関数の作成
const db = require('../db/connection');

async function findUserByEmail(email){
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?',[email]);
    return rows[0];
}

async function findUserById (userId){
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
}

async function createUser(email,passwordHash, occupation, gender, dateOfBirth){
    const [result] = await db.execute(
        'INSERT INTO users (email, password_hash, occupation, gender, date_of_birth) VALUES(?,?,?,?,?)',
        [email, passwordHash, occupation, gender, dateOfBirth]
    );
    // MySQL操作で自動インクリメント
    return result.insertId
}

module.exports = {
    findUserByEmail,
    createUser,
    findUserById
}