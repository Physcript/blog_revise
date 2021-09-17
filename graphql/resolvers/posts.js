

const auth = require('../../utils/auth')
const mongoose = require('mongoose')

const Post = require('../../models/Post')

const {UserInputError} = require('apollo-server-express')


module.exports = {
    Query : {
        async getPopularPost(){
            //
        },
        async getPost(){
            const post = await Post.aggregate([
                {
                    $project:{
                        "_id": "$_id",
                        "body": "$body",
                        "image": "$image",
                        "createdAt": "$createdAt",
                        "firstName": "$firstName"
                    },
                },
                {
                    $lookup:{
                        from:'comments',
                        localField:'_id',
                        foreignField:'post',
                        as:'comments'
                    }
                },
                {
                    $lookup:{
                        from:'likes',
                        localField:'_id',
                        foreignField:'post',
                        as:'likesCount'
                    }
                },
                {
                    $lookup:{
                        from:'comments',
                        let: {
                            "postId": '$_id'
                        },
                        
                        pipeline:[
                            {
                                $match: { $expr : { $eq : ["$post" , "$$postId"]} }
                            },
                            {
                                $sort:{
                                    'createdAt': -1
                                }
                            },
                            { $limit: 1 } 
                        ],
                        as: 'comments'
                    }
                },
                {
                    $project:{
                        "_id": 1,
                        "body": 1,
                        "image": 1,
                        "createdAt": 1,
                        "firstName": 1,
                        "comment":["$comments"],
                        "countComment": { $size : { $ifNull: ["$comments", [] ] } },
                        "countLike": { $size : {$ifNull : ["$likesCount", []]} }
                    }
                },
                {
                    $unwind: "$comment"
                }
            ]).sort({createdAt: -1}).limit(10)
        
            return post
        }
    },
    Mutation: {
        async createPost( _, {body},context ){
            try{
            const user = await auth(context)
            if(body.trim() == ''){
                throw new UserInputError('Error', {
                    'title':'Message required'
                })
            }
            const post = new Post({
                body,
                firstName: user.firstName,
                createdAt:new Date().toISOString(),
                updatedAt:new Date().toISOString(),
                image: user.image ? user.image : '',
                user: user._id
            })

            await post.save()
                
            return 'asd'
            }catch(e){
                return e
            }
        } 
    }
}