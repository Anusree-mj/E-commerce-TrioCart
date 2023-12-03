
const mongoosedb = require('./mongodb');

// carts collection
const CartSchema = new mongoosedb.Schema(
    {
        userId: {
            type: mongoosedb.Schema.Types.ObjectId,
            ref: 'users',
        },
        products: [{
            product: {
                type: mongoosedb.Schema.Types.ObjectId,
                ref: 'products',
            },
            Size: String,
            Count: {
                type: Number,
                default: 1,
            },
        }]
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const cartCollection = new mongoosedb.model("cartProducts", CartSchema);
module.exports = cartCollection