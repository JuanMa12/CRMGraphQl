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
        console.log('######### START CONTEXT ###########')
        //console.log(req.headers)
        const token = req.headers["authorization"] || '';
        const token_remove_bearer = token.replace('Bearer ','');
        console.log("TOKEN:::",token)
        console.log("____________________")
        if(token) {
            try {
                const user = jwt.verify(token_remove_bearer, process.env.JWT_SECRET);
                console.log(user)
                console.log("____________________")
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