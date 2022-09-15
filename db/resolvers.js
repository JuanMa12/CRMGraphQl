const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const User = require('../models/User')
const Product = require('../models/Product')
const Client = require('../models/Client')
const Order = require('../models/Order')

const createToken = (user, secret, expiresIn) => {
    const {id , email, name, surname} = user

    return jwt.sign({id, email, name, surname}, secret, {expiresIn})
}

const resolvers = {
    Query: {
        getUser: async (_, {token}) => {
            const userId = await jwt.verify(token, process.env.JWT_SECRET)

            return userId
        },
        getProducts: async () => {
            try {
                const products = await Product.find({})

                return products
            } catch (error) {
                console.log(error)
            }
        },
        getProduct: async (_, {id}) => {
            try {
                const product = await Product.findById(id)
                if(!product) {
                    throw new Error('Product not exists...')
                }

                return product
            } catch (error) {
                console.log(error)
            }
        },
        getClients: async () => {
            try {
                const clients = await Client.find({})

                return clients
            } catch (error) {
                console.log(error)
            }
        },
        getClientsSeller: async (_, {}, ctx) => {
            try {
                const clients = await Client.find({ seller : ctx.user.id.toString()})

                return clients
            } catch (error) {
                console.log(error)
            }
        },
        getClient: async (_, {id}, ctx) => {
            try {
                const client = await Client.findById(id)
                if(!client) {
                    throw new Error('Client not exists...')
                }

                if(client.seller.toString() !== ctx.user.id) {
                    throw new Error('Not access...')
                }

                return client
            } catch (error) {
                console.log(error)
            }
        },
        getOrders: async () => {
            try {
                const orders = await Order.find({})

                return orders
            } catch (error) {
                console.log(error)
            }
        },
        getClientsSeller: async (_, {}, ctx) => {
            try {
                const orders = await Order.find({ user : ctx.user.id.toString()})

                return orders
            } catch (error) {
                console.log(error)
            }
        },
        getOrder: async (_, {id}, ctx) => {
            try {
                const order = await Order.findById(id)
                if(!order) {
                    throw new Error('Order not exists...')
                }

                if(order.user.toString() !== ctx.user.id) {
                    throw new Error('Not access...')
                }

                return order
            } catch (error) {
                console.log(error)
            }
        },
        getOrderStatus: async (_, {status}, ctx) => {
            try {
                const orders = await Order.find({user : ctx.user.id, status})
                
                return orders
            } catch (error) {
                console.log(error)
            }
        },
        topClients: async () => {
            try {
                const clients = await Order.aggregate([
                    { $match : { status: "COMPLETED" } },
                    { $group : {
                        _id : "$client",
                        total: { $sum: '$total' }
                    }},
                    {
                        $lookup: {
                            from: 'clients',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'client'
                        }
                    },
                    {
                        $limit : 3
                    },
                    {
                        $sort : { total : -1 }
                    }
                ])
                
                return clients
            } catch (error) {
                console.log(error)
            }
        },
        topUsers: async () => {
            try {
                const users = await Order.aggregate([
                    { $match : { status: "COMPLETED" } },
                    { $group : {
                        _id : "$user",
                        total: { $sum: '$total' }
                    }},
                    {
                        $lookup: {
                            from: 'users',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $limit : 3
                    },
                    {
                        $sort : { total : -1 }
                    }
                ])
                
                return users
            } catch (error) {
                console.log(error)
            }
        },
        searchProduct: async (_, {text}) => {
            try {
                const products = await Product.find({ $text : { $search : text }}).limit(10)
                
                return products
            } catch (error) {
                console.log(error)
            }
        },
    },
    Mutation: {
        newUser: async (_, {input}) => {
            const { email, password } = input

            // unique email
            const uniqueEmail = await User.findOne({ email })
            
            if(uniqueEmail) {
                throw new Error('Email exists...')
            }
            // hash password
            const salt = await bcryptjs.genSalt(10)
            input.password = await bcryptjs.hash(password, salt)

            try {
                // save in db
                const user = new User(input)
                user.save()

                return user
            } catch (error) {
                console.log(error)
            }
        },
        authenticateUser: async (_, {input}) => {
            // search user
            const { email, password } = input

            const userExist = await User.findOne({ email })
            if(!userExist) {
                throw new Error('User not exists...')
            }

            // verify password
            const passwordCorrect = await bcryptjs.compare(password,userExist.password)
            if(!passwordCorrect) {
                throw new Error('Password is incorrect...')
            }
            // create token
            const token = createToken(userExist, process.env.JWT_SECRET , '24h')
            return {
                token
            }
        },
        newProduct: async (_, {input}) => {
            try {
                // save in db
                const product = new Product(input)
                product.save()

                return product
            } catch (error) {
                console.log(error)
            }
        },
        updateProduct: async (_, {id, input}) => {
            try {
                
                let product = await Product.findById(id)
                if(!product) {
                    throw new Error('Product not exists...')
                }

                product = await Product.findOneAndUpdate({_id: id}, input, {new: true})

                return product
            } catch (error) {
                console.log(error)
            }
        },
        removeProduct: async (_, {id}) => {
            try {
                
                let product = await Product.findById(id)
                if(!product) {
                    throw new Error('Product not exists...')
                }

                await Product.findOneAndDelete({_id: id})

                return "Producto deleted"
            } catch (error) {
                console.log(error)
            }
        },
        newClient: async (_, {input}, ctx) => {
            const { email } = input
            
            const client = await Client.findOne({ email })
            if(client) {
                throw new Error('Client exists...') 
            }
            // save in db
            const newClient = await new Client(input)
            newClient.seller = ctx.user.id;

            try {
                newClient.save()

                return newClient
            } catch (error) {
                console.log(error)
            }
        },
        updateClient: async (_, {id, input}, ctx) => {
            try {
                
                let client = await Client.findById(id)
                if(!client) {
                    throw new Error('Client not exists...')
                }

                if(client.seller.toString() !== ctx.user.id) {
                    throw new Error('Not access...')
                }

                client = await Client.findOneAndUpdate({_id: id}, input, {new: true})

                return client
            } catch (error) {
                console.log(error)
            }
        },
        removeClient: async (_, {id},ctx) => {
            try {
                
                let client = await Client.findById(id)
                if(!client) {
                    throw new Error('Client not exists...')
                }

                if(client.seller.toString() !== ctx.user.id) {
                    throw new Error('Not access...')
                }

                await Client.findOneAndDelete({_id: id})

                return "Client deleted"
            } catch (error) {
                console.log(error)
            }
        },
        newOrder: async (_, {input}, ctx) => {
            const { client } =  input
            let clientExist = await Client.findById(client)
            if(!clientExist) {
                throw new Error('Client not exists...')
            }

            if(clientExist.seller.toString() !== ctx.user.id) {
                throw new Error('Not access...')
            }

            // valid stock
            for await ( const element of input.order ) 
            {
                const { id } = element

                const product = await Product.findById(id)

                if (element.quantity > product.stock) {
                    throw new Error(`Not Stock Product ${product.name}`)
                } else {
                    product.stock = product.stock - element.quantity;
                    product.save();
                }
            }

            try {
                // save in db
                const order = new Order(input)

                order.user = ctx.user.id;
                const res = await order.save()

                return res
            } catch (error) {
                console.log(error)
            }
        },
        updateOrder: async (_, {id, input}, ctx) => {
            const { client } =  input
            
            try {
                let orderExist = await Order.findById(id)
                if(!orderExist) {
                    throw new Error('Order not exists...')
                }

                if(orderExist.user.toString() !== ctx.user.id) {
                    throw new Error('Not access...')
                }

                if(input.order) {
                    // valid stock
                    for await ( const element of input.order ) 
                    {
                        const { id } = element

                        const product = await Product.findById(id)

                        if (element.quantity > product.stock) {
                            throw new Error(`Not Stock Product ${product.name}`)
                        } else {
                            product.stock = product.stock - element.quantity;
                            product.save();
                        }
                    }
                }

                const res = await Order.findOneAndUpdate({_id: id}, input, {new: true})

                return res
            } catch (error) {
                console.log(error)
            }
        },
        removeOrder: async (_, {id},ctx) => {
            try {
                let orderExist = await Order.findById(id)
                if(!orderExist) {
                    throw new Error('Order not exists...')
                }

                if(orderExist.user.toString() !== ctx.user.id) {
                    throw new Error('Not access...')
                }

                await Order.findOneAndDelete({_id: id})

                return "Order deleted"
            } catch (error) {
                console.log(error)
            }
        },
    }
}

module.exports = resolvers;