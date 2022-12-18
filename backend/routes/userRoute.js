const express = require('express')
const router = express.Router()

const {login, register, logout, getUser} = require('../controllers/userController') 
const protect = require('../middleware/authMiddleware')



router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').get(logout)
router.route('/getUser').get(protect, getUser)


module.exports = router

