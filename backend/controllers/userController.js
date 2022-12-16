const UserModel = require('../models/User')
const { StatusCodes } = require('http-status-codes')
// const jwt = require('jsonwebtoken')
// const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')



const register = async (req, res) => {
    const {name, password, email} = req.body

    if (!email || !password || !name) {
        res.status(StatusCodes.BAD_REQUEST)
        throw new Error('please provide all required fields')
    }

    if (password.length < 6){
        res.status(StatusCodes.BAD_REQUEST)
        throw new Error('please must be more than 6 characters minus white spacing')

    }
    res.send('reegister user')

}

const login= async (req, res) => {

}


module.exports = {register, login}