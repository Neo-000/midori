module.exports = function (req, res, next) {
  console.log('ADMIN MIDDLEWARE:', req.user)
    if (req.user && req.user.role === 'admin') {
      return next()
    }
    return res.status(403).json({ message: 'Нет доступа: только для администратора' })
  }
  