
const mongoosedb = require('mongoose');

mongoosedb.connect("mongodb://localhost:27017/TrioCart")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed to connect');
    });









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
        isBlocked: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const tempUsersCollection = new mongoosedb.model("tempUsers", TemporaryUserSchema);


// sessions collection
const SessionSchema = new mongoosedb.Schema(
    {
        userId: {
            type: mongoosedb.Schema.Types.ObjectId,
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
const sessionCollection = new mongoosedb.model("sessions", SessionSchema);


// admin collection
const AdminCollection = new mongoosedb.Schema({
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
const adminCollection = new mongoosedb.model("admins", AdminCollection)


//admin session
const AdminSessionSchema = new mongoosedb.Schema(
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
const adminSessionCollection = new mongoosedb.model("adminSessions", AdminSessionSchema);








module.exports = {
    // productsCollection,
    // usersCollection,
    tempUsersCollection,
    adminCollection,
    sessionCollection,
    adminSessionCollection,

    // cartCollection,
    mongoosedb
};
// module.exports = mongoosedb
