
const auth = require('../../utils/auth')
const mongoose = require('mongoose')
const { comment_validation } = require('../../utils/validation')
const { UserInputError } = require('apollo-server-express')
const { validate } = require('../../models/User')

const Comment = require('../../models/Comment')

module.exports = {
    Query: {
        async getComment( _, { postId }){
            const comment = await Comment.aggregate([ 
                {
                    $match: { post: mongoose.Types.ObjectId(postId) }
                },
                {
                    $project: {
                        "_id": "$_id",
                        "body": "$body",
                        "firstName": "$firstName",
                        "createdAt": "$createdAt",
                    }
                }
            ])
            return comment 
        }
    },
    Mutation: {
        async createComment(_,{body,postId},context){
            const user = await auth(context)
            try {
                const {valid,errors} = await comment_validation(body,postId)
                if(!valid){
                    throw new UserInputError('Error',{
                        errors
                    })
                }
                const comment = new Comment({
                    body,
                    createdAt:new Date().toISOString(),
                    updatedAt:new Date().toISOString(),
                    firstName:user.firstName,
                    post:postId,
                    user:user._id
                })

                await comment.save()
                return "Comment successful"

            }catch(e){
               return e
            }
        }
    }
}