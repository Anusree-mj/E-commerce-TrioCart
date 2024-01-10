
const mongoosedb = require('./mongodb');

const WalletSchema = new mongoosedb.Schema(
    {
        userId: {
            type: mongoosedb.Schema.Types.ObjectId,
            ref: 'users',
        },
        transactions: [{
            status: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            createdAt: {
                type: Date,
                required: true,
            },
        }],
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);

const walletCollection = new mongoosedb.model("wallets", WalletSchema);
module.exports = walletCollection;
