
const auth = require('../../utils/auth')
const { like_validation } = require('../../utils/validation')
const { UserInputError , AuthenticationError } = require('apollo-server-express')

const mongoose = require('mongoose')

const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const Like = require('../../models/Like')

module.exports = {
    Mutation : {
        async createLike(_,{id},context) {
            const user = await auth(context)
            try{
                const { errors,valid } = await like_validation(id)

                if(!valid) {
                    throw new UserInputError('Error', {
                        errors
                    })
                }

                let likePost = await Like.findOne({ user : user._id , post : id})
                    if(likePost) {
                        await likePost.delete()
                        return 'Like Post Remove'
                    }
                let likeComment = await Like.findOne({ user: user._id , comment: id})
                    if(likeComment) {
                        await likeComment.delete()
                        return 'like Comment Remove'
                    }

                const post = await Post.findById(id)
                if(post){
                    const like = new Like({
                        user: user._id,
                        post: id
                    })
                    await like.save()
                    return "like Post created"
                }
                const comment = await Comment.findById(id)
                if(comment){
                    const like = new Like({
                        user: user._id,
                        comment: id
                    })
                    await like.save()
                    return "Like Comment created"
                }

                if( !comment && !post ){
                    throw new AuthenticationError('UnAuthorized')
                }

                return "Created Likes"
            }
            catch(error) {
                return error
            }
        }
    }
}