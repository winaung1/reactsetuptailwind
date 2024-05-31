const express = require('express')
const router = express.Router()
const {getUser,signupUser, loginUser, verifyToken, updateRole, getOneUser, updateUser}= require('../controllers/userController')

router.get('/user', verifyToken, getUser)
router.post('/update-user/:email', verifyToken, updateUser)
router.get('/one-user/:email', verifyToken, getOneUser)
router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/updaterole', updateRole);


module.exports = router;