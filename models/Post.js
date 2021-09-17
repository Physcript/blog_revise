
const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    body:String,
    createdAt:String,
    updatedAt:String,
    firstName:String,
    image:Buffer,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
const Post = mongoose.model('Post',postSchema)
module.exports = Post