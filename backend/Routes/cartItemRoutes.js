const express = require('express')
const router = express.Router()
const {getAllCart,addToCart, increaseItem, decreaseItem, deletItem, clearCart, getOneCart}= require('../controllers/cartController')

router.get('/', getAllCart)
router.get('/:id', getOneCart)
router.post('/', addToCart)
router.put('/increase/:id', increaseItem)
router.put('/decrease/:id', decreaseItem)
router.delete('/:id', deletItem)
router.delete('/clear/:email', clearCart)


module.exports = router;