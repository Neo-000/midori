const express = require('express')
const router = express.Router()
const catCtrl = require('../controllers/categoryController')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

// Все могут смотреть категории
router.get('/', catCtrl.getAll)

// Только админ может создавать/удалять/обновлять
router.post('/', auth, admin, catCtrl.create)
router.delete('/:id', auth, admin, catCtrl.delete)
router.put('/:id', auth, admin, catCtrl.update)

module.exports = router
