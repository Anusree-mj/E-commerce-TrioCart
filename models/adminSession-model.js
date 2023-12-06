
const mongoosedb = require('./mongodb');

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

module.exports = adminSessionCollection;

