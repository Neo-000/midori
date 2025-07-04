module.exports = function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next()
    }
    return res.status(403).json({ message: 'Нет доступа: только для администратора' })
  }
  