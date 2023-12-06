
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
    })
const paymentCollection = new mongoosedb.model("payments", OnlinePaymentCollection)


module. exports= paymentCollection