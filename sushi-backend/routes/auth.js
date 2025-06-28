const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

// Регистрация
router.post('/register', async (req, res) => {
  try {
    console.log('REGISTER REQUEST BODY:', req.body) // <-- ЛОГ

    const { name, phone, password } = req.body

    const existingUser = await User.findOne({ phone })
    console.log('EXISTING USER:', existingUser) // <-- ЛОГ

    if (existingUser) return res.status(400).json({ message: 'Пользователь уже существует' })

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('HASHED PASSWORD:', hashedPassword) // <-- ЛОГ

    const user = new User({ name, phone, password: hashedPassword })
    await user.save()

    console.log('USER REGISTERED:', user) // <-- ЛОГ

    res.status(201).json({ message: 'Регистрация успешна' })
  } catch (err) {
    console.log('REGISTER ERROR:', err) // <-- ЛОГ
    res.status(500).json({ message: 'Ошибка регистрации' })
  }
})

// Вход
router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN REQUEST BODY:', req.body) // <-- ЛОГ

    const { phone, password } = req.body
    const user = await User.findOne({ phone })

    console.log('USER FOUND:', user) // <-- ЛОГ

    if (!user) {
      console.log('LOGIN FAIL: user not found') // <-- ЛОГ
      return res.status(400).json({ message: 'Неверный телефон или пароль' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log('PASSWORD MATCH:', isMatch) // <-- ЛОГ

    if (!isMatch) {
      console.log('LOGIN FAIL: wrong password') // <-- ЛОГ
      return res.status(400).json({ message: 'Неверный телефон или пароль' })
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('LOGIN SUCCESS:', user.phone) // <-- ЛОГ

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
        bonusPoints: user.bonusPoints,
      }
    })
  } catch (err) {
    console.log('LOGIN ERROR:', err) // <-- ЛОГ
    res.status(500).json({ message: 'Ошибка входа' })
  }
})

module.exports = router
