const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator');
const userModel = require('../models/user.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// /user/test

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        
         if (!errors.isEmpty()) {
           return res.status(400).json({
            errors: errors.array(),
            message: 'invail data'
           })
        }
    const {email ,username,password} = req.body;

    const hashPassword = await bcrypt.hash(password,10)

    const newUser =   await userModel.create({
        email,
        username,
        password:  hashPassword
    })
    res.redirect('/user/login')
})


router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', 
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invail data'
            });
        }

        const {username, password} = req.body;

        const user = await userModel.findOne({
            username: username
            })
            if (!user) {
                return res.status(400).json({
                    message: 'username or password is incorrect'
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({
                    message: 'username or password is incorrect'
                })
            }
            const token = jwt.sign({
                userId: user._id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        )
        res.cookie('token',token)

      
        res.redirect('/home')
    }
)
// In user.routes.js
router.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;

// yha sabhi routes create kia jaynge 

//2:54:09