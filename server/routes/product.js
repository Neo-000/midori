const express = require('express')
const router = express.Router()
const prodCtrl = require('../controllers/productController')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const upload = require('../middlewares/upload')

// Все могут смотреть товары
router.get('/', prodCtrl.getAll)

// Только админ может создавать/удалять/обновлять
router.post('/', auth, admin, upload.single('image'), prodCtrl.create)
router.delete('/:id', auth, admin, prodCtrl.delete)
router.put('/:id', auth, admin, upload.single('image'), prodCtrl.update)

module.exports = router
