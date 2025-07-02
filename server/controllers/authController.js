const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// РЕГИСТРАЦИЯ
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'Email уже зарегистрирован' })

    const hash = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hash, name })
    await user.save()
    res.json({ message: 'Регистрация успешна' })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

// ЛОГИН
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Пользователь не найден' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ message: 'Неверный пароль' })

    // Добавляем роль в payload токена!
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
