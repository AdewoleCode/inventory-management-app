// const User = require('../models/User')
const UserModel = require('../models/User')
const { StatusCodes } = require('http-status-codes')
// const jwt = require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')



const register = async (req, res) => {

    const {name, password, email} = req.body

    if (!email || !password || !name) {
        throw new BadRequestError('please provide name, username and password')
    }

    if (password.length < 6){
        throw new BadRequestError('password must be more than 6 atleast 6 characters')
    }

    const existingUser = await UserModel.findOne({email})

    if (existingUser){
        throw new BadRequestError('email already used, choose another email')
    }

    const user = await UserModel.create({name, email, password, })

    if (user){
        const { _id, name, email, bio, phone, photo } = user
        res.status(StatusCodes.CREATED).json({ name, email, _id, bio, phone, photo})
    } else {
        throw new BadRequestError('invalid user data')
    }
    
}

const login= async (req, res) => {

}


module.exports = {register, login}