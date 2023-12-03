const mongoosedb = require('./mongodb');
// users collection
const UserSchema = new mongoosedb.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
        },
        isBlocked: {
            type: Boolean,
            default: false,
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
        orderAddress: [
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
        ]
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const usersCollection = new mongoosedb.model("users", UserSchema);

module.exports = usersCollection