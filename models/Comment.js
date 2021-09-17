

const mongoose = require('mongoose')
const commentSchema = mongoose.Schema({
    body:String,
    createdAt:String,
    updatedAt:String,
    firstName:String,
    image:String,
    post : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
const comment = mongoose.model('Comment',commentSchema)

module.exports = comment