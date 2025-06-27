// サインアップAPI
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser} = require('../models/userModels.js');

const router = express.Router();

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

module.exports = router;