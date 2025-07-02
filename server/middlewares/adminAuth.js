// server/middleware/adminAuth.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports.adminAuth = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Нет токена' })

  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    // Меняй условие под свои нужды, например, по email:
    // if (!user || (user.role !== 'admin' && user.email !== 'youremail@site.com'))
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Нет доступа' })
    req.user = user
    next()
  } catch (e) {
    res.status(401).json({ message: 'Неверный токен' })
  }
}
