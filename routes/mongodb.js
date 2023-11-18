const { Admin } = require('mongodb');
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
        detailedImages: {
            type: Array,
            requires: true,
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
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const usersCollection = new mongoose.model("users", UserSchema);

const TemporaryUserSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const tempUsersCollection = new mongoose.model("tempUsers", TemporaryUserSchema);

const SessionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        sessionId: {
            type: String,
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const sessionCollection = new mongoose.model("sessions", SessionSchema);

const AdminCollection = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const adminCollection = new mongoose.model("admins", AdminCollection)

const AdminSessionSchema = new mongoose.Schema(
    {
        adminId: {
            type: String,
        },
        sessionId: {
            type: String,
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const adminSessionCollection = new mongoose.model("adminSessions", AdminSessionSchema);

const CategorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
        },
        subCategory: [
            {
                name: {
                    type: String,
                    required: true,
                }, isDeleted: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const categoryCollection = new mongoose.model("categories", CategorySchema);

module.exports = {
    productsCollection,
    usersCollection,
    tempUsersCollection,
    adminCollection,
    sessionCollection,
    adminSessionCollection,
    categoryCollection,
};
