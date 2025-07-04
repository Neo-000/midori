const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/auth')

router.post('/register', authController.register)
router.post('/login', authController.login)

// Новый роут /me
router.get('/me', authMiddleware, authController.me)

module.exports = router
