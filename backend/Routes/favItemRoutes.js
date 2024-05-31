const express = require('express')
const router = express.Router()
const {getOneFav,getAllFav,addToFav, increaseItem, decreaseItem, deletItem, clearFav}= require('../controllers/favController')

router.get('/', getAllFav)
router.get('/:id', getOneFav)
router.post('/', addToFav)
router.put('/increase/:id', increaseItem)
router.put('/decrease/:id', decreaseItem)
router.delete('/:id', deletItem)
router.delete('/clear/:id', clearFav)


module.exports = router;