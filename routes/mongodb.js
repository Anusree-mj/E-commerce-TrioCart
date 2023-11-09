const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/TrioCart")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed to connect');
    });

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        detailed_description: {
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
            type: String,
            required: true,
        },
        size: {
            type: Array,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);

const productsCollection = new mongoose.model("products", ProductSchema);

const UserSchema = new mongoose.Schema(
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
        address: {
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);

const usersCollection = new mongoose.model("users", UserSchema);


module.exports = { productsCollection, usersCollection };
