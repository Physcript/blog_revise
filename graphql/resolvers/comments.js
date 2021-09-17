
const auth = require('../../utils/auth')
const mongoose = require('mongoose')
const { comment_validation } = require('../../utils/validation')
const { UserInputError } = require('apollo-server-express')
const { validate } = require('../../models/User')

const Comment = require('../../models/Comment')

module.exports = {
    Query: {
        async getComment( _, { postId , skip , limit }){
            const comment = await Comment.aggregate([ 
                {
                    $match: { post: mongoose.Types.ObjectId(postId) }
                },
                {
                    $sort:{ 'createdAt': -1 }
                },
                {
                    $project: {
                        "_id": "$_id",
                        "body": "$body",
                        "firstName": "$firstName",
                        "createdAt": "$createdAt",
                    }
                },
                {
                    $lookup:{
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'comment',
                        as: 'commentLike'
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "body": 1,
                        "firstName": 1,
                        "createdAt": 1,
                        "commentLikes" : { $size: { $ifNull: [ '$commentLike' , [] ]   } }
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
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
                return comment

            }catch(e){
               return e
            }
        }
    }
}