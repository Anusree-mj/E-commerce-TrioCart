
const mongoosedb = require('./mongodb');

// carts collection
const cashBackSchema = new mongoosedb.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        cashBack: {
            type: Number,
            required: true,
        },
        isValid: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const cashBackCollection = new mongoosedb.model("cashBacks", cashBackSchema);
module.exports = cashBackCollection