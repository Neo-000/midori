const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

// Только админ может загружать картинки
router.post('/', auth, admin, upload.single('image'), (req, res) => {
  // возвращаем url для фронта
  res.json({ url: '/uploads/' + req.file.filename })
})

module.exports = router
