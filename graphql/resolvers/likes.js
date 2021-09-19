
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

                const generateCount = async (id , action) => {
                    if(action == 'comment'){ 
                        const countLike = await Like.find( {comment: mongoose.Types.ObjectId(id)} )
                        const countLikes = countLike.length
                        return countLikes
                    }else{
                        const countLike = await Like.find( {post: mongoose.Types.ObjectId(id)} )
                        const countLikes = countLike.length
                        return countLikes
                    }
                }

                if(!valid) {
                    throw new UserInputError('Error', {
                        errors
                    })
                }

                let likePost = await Like.findOne({ user : user._id , post : id})
                    if(likePost) {
                        await likePost.delete()
                        
                        return  await generateCount(id , action = 'post')
                    }
                let likeComment = await Like.findOne({ user: user._id , comment: id})
                    if(likeComment) {
                        await likeComment.delete()
                        return  await generateCount(id ,  action = 'comment')
                    }

                const post = await Post.findById(id)
                if(post){
                    const like = new Like({
                        user: user._id,
                        post: id
                    })
                    await like.save()
                    return await generateCount(id)
                }
                const comment = await Comment.findById(id , action = "post")

                if(comment){
                    const like = new Like({
                        user: user._id,
                        comment: id
                    })
                    
                    await like.save()
                   
                    return  await generateCount(id, action = "comment")
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