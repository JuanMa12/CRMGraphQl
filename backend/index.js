const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

const connectDB = require('./config/db')

//connect DB
connectDB();

//server
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({req}) => {
        const token = req.headers["authorization"] || '';
        //console.log("TOKEN::: ",token)
        if(token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                console.log(user.id)

                return { user }
            } catch (error) {
                console.log(error)
            }
        }
    }
});

//start server
const port = process.env.PORT || 4001;
server.listen({port}).then( ({url}) => {
    console.log(`Server running in ${url}`)
})