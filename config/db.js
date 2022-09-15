const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {})
        console.log("DB conected!")
    } catch (error) {
        console.log("Error in conection...")
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB