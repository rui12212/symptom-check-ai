// サインアップAPI
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser} = require('../models/userModels.js');

const router = express.Router();

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
        if(!user){
            return res.status(404).json({ error: 'User Not Found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid){
            return res.status(401).json({ error: 'Incorrect password'});
        }

        const token =  jwt.sign({ userId: user.id}, process.env.JWT_SECRET,{
            expiresIn: '7d',
        });

        res.status(200).json({message: 'Login successful', token});

    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }

})


module.exports = router;