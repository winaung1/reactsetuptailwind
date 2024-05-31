const express = require('express')
const router = express.Router()
const {forgotPassword, updatePassword} = require('../controllers/forgotPassController')

router.post('/forgot-password', forgotPassword)
router.post('/update-password', updatePassword)

module.exports = router