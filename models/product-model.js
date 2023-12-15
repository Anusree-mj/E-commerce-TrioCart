// products collection
const mongoosedb = require('./mongodb');
const ProductSchema = new mongoosedb.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        subCategory: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        size: {
            type: Array,
            required: true,
        },
        sizesStock: [{
            size: {
                type: String,
                required: true,
            },
            count: {
                type: Number,
                required: true,
                default: 500,
            },
        }],
        color: {
            type: Array,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        detailedImages: {
            type: Array,
            requires: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        offerPrice: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const productsCollection = new mongoosedb.model("products", ProductSchema);
module.exports = productsCollection;