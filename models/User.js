
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    email:String,
    password:String,
    firstName:String,
    lastName:String,
    image:Buffer,
    token:String,
    refreshToken:String,
    verified:Boolean,
    createdAt:String,
    updatedAt:String
})
const User = mongoose.model('User',userSchema)
module.exports = User