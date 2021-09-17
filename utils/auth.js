
require('dotenv').config()
const {AuthenticationError} = require('apollo-server-express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = async (context) => {
    try {
        if(!context.req.headers.authorization){
            throw new AuthenticationError('Error')
        }
        const token = context.req.headers.authorization.split('Bearer ')[1]
        const decode = jwt.verify(token,process.env.JWT_SECRET , (error,decoded) => {
            if(error){
                throw new AuthenticationError('Error')
            }else {
                return decoded
            }
        })
        const user = await User.findById(decode._id)
        if(!user){
            throw new AuthenticationError('Error')
        }
        return user
    }
    catch(e){
        throw new AuthenticationError('Error')
    }
}