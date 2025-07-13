const express = require('express')
const router = express.Router()
const User = require('../models/User') // путь до твоей модели User
const authMiddleware = require('../middlewares/auth') // если используешь авторизацию (например, JWT)

// Получить профиль пользователя (опционально)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения профиля' })
  }
})

// Обновить профиль пользователя
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления профиля' })
  }
})

module.exports = router
