const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Для дебага — убери, если не нужен
  console.log('AUTH MIDDLEWARE:', req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Тут твой { _id, role, ... }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};
