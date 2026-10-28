const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/logout', authMiddleware.auth_User_Middleware, authController.logoutUser);
router.get('/profile', authMiddleware.auth_User_Middleware, authController.getProfile)
module.exports = router