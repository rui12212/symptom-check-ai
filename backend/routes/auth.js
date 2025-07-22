// サインアップAPI
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, findUserById} = require('../models/userModels.js');
const router = express.Router();

// /meを追加する時に下記も追加
const authenticateToken = require('../utils/jwt');

// signup＝User作成機能
router.post('/signup', async(req, res)=> {
    try {
        const {email, password, occupation, gender, dateOfBirth} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required'});
        }
        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({ error: 'Email already inm use'});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = await createUser(email, passwordHash, occupation,gender,dateOfBirth);
        const token =  jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.status(201).json({ message: 'User created successfully', token});
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server error'
        });
    }
});

// login-Userログイン機能
router.post('/login', async(req,res) => {
    try{
        // request内容からemailとpasswordを取得
        const {email, password} = req.body;
        // 空欄の場合
        if(!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }
        // userを取得
        const user = await findUserByEmail(email);
        const userId = user.id;
        if(!user){
            return res.status(404).json({ error: 'User Not Found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid){
            return res.status(401).json({ error: 'Incorrect password'});
        }

        // JWT生成。この時点で、JWTがdecodeされた場合に、下記の￥情報が手に入る。
        // authenticateTokenを行うと、この情報が手に入るため、必然的にuserIdでUserを探すことになる
        const token =  jwt.sign({ userId: user.id}, process.env.JWT_SECRET,{
            expiresIn: '7d',
        });

        res.status(200).json({message: 'Login successful', token, userId});

    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }

})

// 現在ログイン中のユーザー情報を返す /api/auth/me を作成
router.get('/me', authenticateToken, async(req,res) => {
    try {
        // JWTのTOKENの生成時にuserIdをKeyに設定しているため、TokenをdecodeしてUserをfindする時は必然的に、userId（key）で探す
        const user = await findUserById(req.user.userId);

        if(!user) return res.status(404).json({ error: 'User not found'});

        res.status(200).json({
            id: user.id,
            email: user.email,
            occupation: user.occupation,
            gender: user.gender,
            dateOfBirth: user.date_of_birth,
        });
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error'});
    }
});

module.exports = router;