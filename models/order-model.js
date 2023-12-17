
const mongoosedb = require('./mongodb');

// order collection
const OrderSchema = new mongoosedb.Schema(
    {
        userId: {
            type: mongoosedb.Schema.Types.ObjectId,
            ref: 'users',
        },
        billingAddress: [
            {
                name: {
                    type: String,
                    required: true,
                }, phone: {
                    type: Number,
                    required: true,
                },
                address: {
                    type: String,
                    required: true,
                },
                town: {
                    type: String,
                    required: true,
                },
                pincode: {
                    type: Number,
                    required: true,
                },
                state: {
                    type: String,
                    required: true,
                }
            },
        ],
        products: [{
            product: {
                type: mongoosedb.Schema.Types.ObjectId,
                ref: 'products',
            },
            Size: {
                type: String,
            },
            Count: {
                type: Number,
            },
            isReturned: {
                type: Boolean,
                default: false,
            },
            returnStatus: {
                type: String,
            },
            isCancelled: {
                type: Boolean,
                default: false,
            },
             cancelStatus: {
                type: String,
            },
        }],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        estimatedDelivery: {
            type: String,
        },
        deliveredDate: {
            type: String,
        },
        returnDate: {
            type: String,
        },
        returnValid: {
            type: Boolean,
            default: false
        },
        orderStatus: {
            type: String,
            default: 'placed',
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const orderCollection = mongoosedb.model("orders", OrderSchema);

module.exports = orderCollection
