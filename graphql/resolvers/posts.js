

const auth = require('../../utils/auth')
const mongoose = require('mongoose')
const {update_post_validation} = require('../../utils/validation')

const Post = require('../../models/Post')

const {UserInputError} = require('apollo-server-express')


module.exports = {
    Query : {
        async checkAction( _,{postId},context ){
            try{
                const user = await auth(context)
                const post = await Post.findOne( {_id: postId, user: mongoose.Types.ObjectId(user._id) } )
                    if(!post){
                       return false
                    }
                return true
            }catch(e){
                console.log(e)
            }
        },
        async getPost(){
            const post = await Post.aggregate([
                {
                    $project:{
                        "_id": "$_id",
                        "body": "$body",
                        "image": "$image",
                        "createdAt": "$createdAt",
                        "firstName": "$firstName",
                        "user": "$user"
                    },
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
                            }
                            
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
                        "user":1,
                        "countComment": { $size : { $ifNull: ["$comments", [] ] } },
                        "countLike": { $size : {$ifNull : ["$likesCount", []]} }
                    }
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
        },
        async updatePost( _,{postId , body} , context) {
            const user = await auth(context)

            try{
                const { errors , valid } = await update_post_validation(postId,user._id,body)
                
                if( !valid ) {
                    throw new UserInputError('Errors', {
                        errors
                    })
                }

                const filter = { _id: mongoose.Types.ObjectId(postId) }
                const update = { body: body }

                let post = await Post.findOneAndUpdate(filter, update)
                
                return "updated"

            }catch(e){
                return e
            }
        } 
    }
}