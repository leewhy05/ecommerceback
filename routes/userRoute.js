const express = require('express')
const { registration, login, getUser, isLoggedIn, forgotPassword, resetPassword } = require('../controller/userController')
const router = express.Router()
const auth = require('../middleware/auth')

//registration
router.post('/registration',registration)
router.post('/login',login)
router.get('/getusername', auth ,getUser)
router.get('/isloggedin',isLoggedIn)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:resetToken',resetPassword)

module.exports = router