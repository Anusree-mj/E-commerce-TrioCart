const mongoosedb = require('./mongodb');

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

module.exports = sessionCollection