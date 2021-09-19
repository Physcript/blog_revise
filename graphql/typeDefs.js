

const {gql} = require('apollo-server-express')


module.exports = gql`
    
    type User {
        _id:ID
        email:String
        firstName:String,
        lastName:String,
        token:String,
        createdAt:String,
        updatedAt:String
    }
    type Comment {
        _id:ID
        body:String
        firstName:String
        createdAt:String
        countLike:Int
        commentLikes: Int
    }

    type Post {
        _id:ID
        body:String
        createdAt:String
        updatedAt:String
        firstName:String
        comment: [Comment]
        countComment: Int
        countLike: Int
    }

    type Like {
        _id:ID
        post:String
        comment:String
        user:String
    }

    type Query {
        dummy:String
        getPost:[Post]
        getPopularPost:[Post]
        getComment( postId:String , skip: Int, limit:Int ):[Comment]
    }

    type Mutation {
        
        createUser(
            email:String
            password:String
            confirmPassword:String
            firstName:String
            lastName:String
            ):String
        
        login(
            email:String,
            password:String
            ):User
        
        createPost(
            body:String
        ):String
        
        createComment(
            body:String
            postId:String
        ):Comment
        
        createLike(id:String):Int,

        updatePost(postId:String,body:String):String
    }

`