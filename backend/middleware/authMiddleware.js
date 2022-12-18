const UserModel = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')


const protect = async (req, res, next) => {
    const token = req.cookies.token

    try {
        if(!token){
            throw new UnauthenticatedError('user not authorized')
        }  else {
            const verifiedUser = jwt.verify(token, process.env.JWT_SECRET)

            const user = await UserModel.findById(verifiedUser.id).select('-password')

            if (!user){
                throw new NotFoundError('user not found!')
            }

            req.user = user
            next()
        }        
    } catch (error) {
        throw new UnauthenticatedError('user not authorized')
    }


}

module.exports = protect