const express = require('express')
const router = express.Router()
const {getAllCompletedOrder, addToCompletedOrder, getOneCompletedOrder, updateCompletedOrder}= require('../controllers/completedOrderController')

router.get('/get-completed-order', getAllCompletedOrder)
router.get('/get-one-completed-order/:email', getOneCompletedOrder)
router.post('/add-completed-order', addToCompletedOrder)
router.post('/update-completed-order', updateCompletedOrder)



module.exports = router;