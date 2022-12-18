const UserModel = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const bcrypt = require('bcryptjs')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})

}



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

    const token = generateToken(user._id)

    //send only-http cookie
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        security: true
    })

    if (user){
        const { _id, name, email, bio, phone, photo } = user
        res.status(StatusCodes.CREATED).json({ name, email, _id, bio, phone, photo, token})
    } else {
        throw new BadRequestError('invalid user data')
    }
    
}

const login= async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new BadRequestError('please provide email and password!')
    }
    //check if user exists
    const user = await UserModel.findOne({email})

    if (!user){
        throw new BadRequestError('user not found, please signup!')
    }

    // const passwordIsCorrect = await bcrypt.compare(password, user.password)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch){
        throw new UnauthenticatedError('invalid credentials')
    }


    const token = generateToken(user._id)

    //send only-http cookie
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        security: true
    })


    if (user && isMatch){
        const { _id, name, email, bio, phone, photo } = user
        res.status(StatusCodes.OK).json({
            name, email, _id, bio, phone, photo, token
        })
    } else {
        throw new BadRequestError('invalid email or password')
    }
}

const logout = async (req, res) => {
    res.cookie('token', "", {
        path: '/',
        httpOnly: true,
        expiresIn: new Date(0),
        sameSite: "none",
        security: true
    })

    return res.status(StatusCodes.OK).json({msg: "successfully logged out"})
}


//get user data
const getUser = async (req, res) => {
    const user = await UserModel.findById(req.user._id)

    if(user){
        const { _id, name, email, bio, phone, photo } = user
        res.status(StatusCodes.OK).json({
            name, email, _id, bio, phone, photo
        })
    } else {
        throw new NotFoundError('user not found!')
    }

}


module.exports = {register, login, logout, getUser}