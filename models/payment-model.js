
const mongoosedb = require('./mongodb');

// payment collection
const OnlinePaymentCollection = new mongoosedb.Schema({
    userId: {
        type: mongoosedb.Schema.Types.ObjectId,
        ref: 'users',
    },
    orderId: {
        type: mongoosedb.Schema.Types.ObjectId,
        ref: 'orders',
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
    }
})
const paymentCollection = new mongoosedb.model("payments", OnlinePaymentCollection)


module.exports = paymentCollection