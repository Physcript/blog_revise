
require('dotenv').config()
const {create_user_validation , login_validation} = require ('../../utils/validation')
const mongoose = require('mongoose')
const {UserInputError} = require('apollo-server-express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const auth = require('../../utils/auth')

module.exports = {
    Mutation: {

        async getProfile(_,{id},context){
            const user = await auth(context)
            try {  
                const myUser = await User.findById(mongoose.Types.ObjectId(id))
                console.log(myUser)
                if(!myUser){
                    throw new Error
                }
                return myUser
            }catch(e){
                return e
            }
        },
        async login(_,{email,password}){
            try {
                const user = await login_validation(email.toLowerCase(),password)
                const token = jwt.sign({ _id: user._id } , process.env.JWT_SECRET )
                
                user.token = token
                await user.save()
        

                return user
            }catch(e){
                return e
            }
        },
        async createUser(_,{email,password,confirmPassword,firstName,lastName}){
            try {
                const {errors,valid} = await create_user_validation(email,password,confirmPassword,firstName,lastName)
                if(!valid){
                    throw new UserInputError('Error',{
                        errors
                    })
                }
                const encrypt = await bcrypt.hash(password,8)
                const user = new User({
                    email:email.toLowerCase(),
                    password:encrypt,
                    firstName,
                    lastName,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })

                await user.save()
                return 'User Created'
                
            }catch(e){
                return e
            }
        }
    }
}