
const mongoosedb = require('./mongodb');

// carts collection
const CouponSchema = new mongoosedb.Schema(
    {
        name: {
            type: String,
            required:true,
        },
        description: {
            type: String,
            required:true,
        },
        minAmount: {
            type: Number,
            required:true,
        },
        discount: {
            type: Number,
            required:true,
        },
        couponActivatingDate:{
            type: Date,
            required:true
        },
        couponDeactivatingDate: {
            type: Date,
            required:true
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
const couponCollection = new mongoosedb.model("coupons", CouponSchema);
module.exports = couponCollection