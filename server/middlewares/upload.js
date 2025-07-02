const multer = require('multer')
const path = require('path')

// Хранилище: всё кидаем в /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, unique + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // Разрешаем только картинки
  if (/image\/(jpeg|jpg|png|webp)/.test(file.mimetype)) cb(null, true)
  else cb(new Error('Только картинки!'), false)
}

const upload = multer({ storage, fileFilter })

module.exports = upload
