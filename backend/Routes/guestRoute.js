const express = require('express')
const router = express.Router()
const {getGuest, getOneGuest, addGuest}= require('../controllers/guestController')

router.get('/guest', getGuest)
router.get('/guest/:email', getOneGuest)
router.post('/add-guest', addGuest)



module.exports = router;