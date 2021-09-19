
const validator = require('validator')
const bcrypt = require('bcrypt')
const { findOne } = require('../models/User')
const { UserInputError } = require('apollo-server-express')

const auth = require('./auth')

const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const mongoose  = require('mongoose')

module.exports.create_user_validation = async (email,password,confirmPassword,firstName,lastName) => {
    const errors = {}
    if (!validator.isEmail(email)){
        errors.email = 'Invalid Email'
    }
    if (password.trim() == ''){
        errors.password = 'Password required'
    }
    if (password !== confirmPassword){
        errors.password = 'Password not match',
        errors.confirmPassword = 'ConfirmPassword not match'
    }else if ( password.length <= 5 ){
        errors.password = 'Password required minimum 6 letters'
    }
    if (firstName.trim() == ''){
        errors.firstName = 'Firstname required'
    }
    if (lastName.trim() == ''){
        errors.lastName = 'Lastname required'
    }
    const user = await User.findOne({email})
    if(user){
        errors.email = 'Email already taken'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.login_validation = async (email,password) => {
    try{
        const checkEmail = await User.findOne({ email })
        if(!checkEmail){
            throw new UserInputError('Error', {
                'title':'Incorrect Email/Password'
            })
        }
        const isMatch = await bcrypt.compare(password,checkEmail.password)
        if(!isMatch){
            throw new UserInputError('Error', {
                'title':'Incorrect Email/Password'
            })
        }
        return checkEmail
    }catch(e) {
        throw new UserInputError('Error', {
            'title':'Incorrect Email/Password'
        })
    }

}

module.exports.comment_validation = async (body,postId) => {
    const errors = {}
    
    if(body.trim() == ''){
        errors.message = 'Message required'
    }
    postId.trim() == '' ? (
        errors.title = "Invalid Action"
    ) : (
        post = await Post.findById(postId)
    )
    if(!post){
        errors.title = 'Post Not Found'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.like_validation = async (id) => {
    const errors = {}

    if(id.trim() == ''){
        errors.title = 'Invalid Action'
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    }

}
module.exports.update_post_validation = async (postId, context, body ) => {

    const errors = {}

    console.log(body)

    const post = await Post.findOne( { _id:postId, user : mongoose.Types.ObjectId(context)   } )

    { !post ? (
        errors.title = 'UnAuthorized'
    ) : '' }

    if(body.trim() == ''){
        errors.message = "Message is required"
    }
    
    return {
        errors,
        valid : Object.keys(errors).length < 1
    }
    
}