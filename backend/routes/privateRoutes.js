const express = require('express')
const { getPrivateData } = require('../controllers/privateController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').get(protect, getPrivateData)

module.exports = router
