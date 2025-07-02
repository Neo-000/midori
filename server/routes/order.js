const express = require('express')
const router = express.Router()
const orderCtrl = require('../controllers/orderController')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

// Создать заказ (можно и без авторизации)
router.post('/', authOptional, orderCtrl.create)

// Получить свои заказы (только для залогиненного)
router.get('/my', auth, orderCtrl.getMy)

// Получить все заказы (только админ)
router.get('/', auth, admin, orderCtrl.getAll)

// Обновить статус заказа (только админ)
router.put('/:id/status', auth, admin, orderCtrl.updateStatus)

// --- authOptional middleware --- (если хочешь, чтобы заказы могли делать и незалогиненные)
function authOptional(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const jwt = require('jsonwebtoken')
    try {
      const token = authHeader.split(' ')[1]
      req.user = jwt.verify(token, process.env.JWT_SECRET)
    } catch {}
  }
  next()
}

module.exports = router
