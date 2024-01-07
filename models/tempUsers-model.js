
const mongoosedb = require('./mongodb');

// temporary users collection
const TemporaryUserSchema = new mongoosedb.Schema(
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
        otpExpiryTime: {
            type: Date,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        otpExpired: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoosedb.Schema.Types.ObjectId,
            ref: 'users',
        },
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const tempUsersCollection = new mongoosedb.model("tempUsers", TemporaryUserSchema);

module.exports = tempUsersCollection