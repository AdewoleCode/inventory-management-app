const express = require('express')
const router = express.Router()

const {login, register, logout, getUser, loginStatus, updateUser, updatePassword, forgotPassword} = require('../controllers/userController') 
const protect = require('../middleware/authMiddleware')



router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').get(logout)
router.route('/getUser').get(protect, getUser)
router.route('/loggedin').get(loginStatus)
router.route('/updateuser').patch(protect, updateUser)
router.route('/updatepassword').patch(protect, updatePassword)
router.route('/forgotpassword').post(forgotPassword)

module.exports = router

