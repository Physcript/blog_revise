require('dotenv').config()

const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const express = require('express')
const mongoose = require('mongoose')



const Server = async (typeDefs,resolvers) => {

    const app = express()

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => ({req})
    })

    await server.start()

    server.applyMiddleware({
        app,
        path : "/"
    })

    const PORT = process.env.PORT || 5000

    mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true
    }).then( () => {
        console.log(`DATABASE CONNECTED`)
        app.listen(PORT, () => { 
            console.log(`SERVER RUNNING PORT: ${PORT}`)
        })
        
    })

}


Server(typeDefs,resolvers)