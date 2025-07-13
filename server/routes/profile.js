const express = require('express')
const router = express.Router()
const User = require('../models/User') // путь до твоей модели User
const authMiddleware = require('../middlewares/auth') // если используешь авторизацию (например, JWT)

// Получить профиль пользователя (опционально)
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('[PROFILE][GET] req.user:', req.user)
    // исправлено на userId
    const user = await User.findById(req.user.userId).select('-password')
    console.log('[PROFILE][GET] found user:', user)
    res.json(user)
  } catch (err) {
    console.error('[PROFILE][GET] error:', err)
    res.status(500).json({ message: 'Ошибка получения профиля' })
  }
})

// Обновить профиль пользователя
router.put('/', authMiddleware, async (req, res) => {
  try {
    console.log('[PROFILE][PUT] req.user:', req.user)
    console.log('[PROFILE][PUT] req.body:', req.body)
    const { name, phone } = req.body

    // исправлено на userId
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone },
      { new: true }
    ).select('-password')

    console.log('[PROFILE][PUT] updated user:', user)
    res.json(user)
  } catch (err) {
    console.error('[PROFILE][PUT] error:', err)
    res.status(500).json({ message: 'Ошибка обновления профиля' })
  }
})

module.exports = router
