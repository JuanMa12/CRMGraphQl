const { gql } = require('apollo-server')

const typeDefs = gql`
    type UserSchema {
        id: ID
        name: String
        surname: String
        email: String
        created_at: String
    }

    type ProductSchema {
        id: ID
        name: String
        stock: Int
        price: Float
        created_at: String
    }

    type ClientSchema {
        id: ID
        name: String
        surname: String
        business: String
        email: String
        phone: String,
        seller: ID
    }

    type OrderSchema {
        id: ID
        order: [OrderGroup]
        total: Float
        client: ID
        user: ID
        created_at: String
        status: StatusOrder
    }

    type OrderGroup {
        id: ID
        quantity: Int
    }

    type Token {
        token: String
    }

    type TopClient {
        total: Float
        client: ClientSchema
    }

    type TopUser {
        total: Float
        user: UserSchema
    }

    input UserInput {
        name: String!
        surname: String!
        email: String!
        password: String!
    }

    input AuthenticateUserInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        stock: Int!
        price: Float!
    }

    input ClientInput {
        name: String!
        surname: String!
        business: String!
        email: String!
        phone: String
    }

    input OrderProductInput {
        id: ID
        quantity: Int
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float
        client: ID
        status: StatusOrder
    }

    enum StatusOrder {
        PENDING
        COMPLETED
        CANCELLED
    }

    type Query {
        # Users
        getUser(token: String!) : UserSchema

        # Products
        getProducts : [ProductSchema]
        getProduct(id: ID!) : ProductSchema

        # Clients
        getClients : [ClientSchema]
        getClientsSeller : [ClientSchema]
        getClient(id: ID!) : ClientSchema

        # Orders
        getOrders : [OrderSchema]
        getOrdersSeller : [OrderSchema]
        getOrder(id: ID!) : OrderSchema
        getOrderStatus(status: String!): OrderSchema

        # Searchs 
        topClients: [TopClient]
        topUsers: [TopUser]
        searchProduct( text: String!) : [ProductSchema]
    }

    type Mutation {
        # Users
        newUser(input: UserInput) : UserSchema
        authenticateUser(input: AuthenticateUserInput) : Token

        # Products
        newProduct(input: ProductInput) : ProductSchema
        updateProduct(id: ID!, input: ProductInput) : ProductSchema
        removeProduct(id: ID!) : String

        # Clients
        newClient(input: ClientInput) : ClientSchema
        updateClient(id: ID!, input: ClientInput) : ClientSchema
        removeClient(id: ID!) : String

        # Orders 
        newOrder(input: OrderInput) : OrderSchema
        updateOrder(id: ID!, input: OrderInput) : OrderSchema
        removeOrder(id: ID!) : String
    }
`;

module.exports = typeDefs;