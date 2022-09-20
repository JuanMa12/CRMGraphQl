const mongoose = require('mongoose')


const OrdderSchema = mongoose.Schema({
    order: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: "PENDING"
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('Order',OrdderSchema)