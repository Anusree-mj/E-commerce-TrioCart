const mongoosedb = require('./mongodb');

// product return collection
const productReturnSchema = new mongoosedb.Schema(
    {
        productId: {
            type: mongoosedb.Schema.Types.ObjectId,
            ref: 'products',
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        returnStatus: {
            type: String,
        },
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const productReturnCollection = mongoosedb.model("returns", productReturnSchema);

module.exports = productReturnCollection
