const { Admin } = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/TrioCart")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed to connect');
    });
// products collection
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


// users collection
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
        ]
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const usersCollection = new mongoose.model("users", UserSchema);


// temporary users collection
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


// sessions collection
const SessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
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


// admin collection
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


//admin session
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


// category collection
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


// carts collection
const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
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
const cartCollection = new mongoose.model("cartProducts", CartSchema);

// order collection
const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
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
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            Size: String,
            Count: {
                type: Number,
            },
        }],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        estimatedDelivery: {
            type: String,
            required: true,
        },
        orderStatus: {
            type: String,
            default: 'placed',
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const orderCollection = new mongoose.model("orders", OrderSchema);

module.exports = {
    productsCollection,
    usersCollection,
    tempUsersCollection,
    adminCollection,
    sessionCollection,
    adminSessionCollection,
    categoryCollection,
    cartCollection,
    orderCollection,
};
