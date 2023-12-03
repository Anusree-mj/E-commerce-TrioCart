
const {mongoosedb} = require('./mongodb');

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
            Size: String,
            Count: {
                type: Number,
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
            required: true,
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
