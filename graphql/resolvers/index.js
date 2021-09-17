
const userResolvers = require('./users')
const postResolvers = require('./posts')
const commentResolver = require('./comments')
const likeResolver = require('./likes')

module.exports = {
    Query:{
        ...postResolvers.Query,
        ...commentResolver.Query
    },
    Mutation: {
       ...userResolvers.Mutation,
       ...postResolvers.Mutation,
       ...commentResolver.Mutation,
       ...likeResolver.Mutation
    }
}