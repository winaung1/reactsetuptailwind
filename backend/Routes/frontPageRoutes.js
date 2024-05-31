const express = require('express')
const router = express.Router()
const {getAllItems, getUpload, uploadPhotos, deleteItem}= require('../controllers/frontPageController')

router.get('/allItems', getAllItems)
router.get('/upload/:key', getUpload)
router.post('/upload', uploadPhotos)
router.post('/delete', deleteItem)

module.exports = router;