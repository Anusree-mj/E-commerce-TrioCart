const collection = require('../../../models/index-model')

module.exports = {


    saveSessions: async (sessionId, userId) => {
        try {
            const data = {
                userId: userId,
                sessionId: sessionId
            }
            await collection.sessionCollection.insertMany([data])
        }
        catch (err) {
            console.log(err, 'session storing failed')
        }
    },

    checkSessions: async (sessionId) => {
        try {
            const checkSession = await collection.sessionCollection.findOne({
                sessionId: sessionId,
            }).populate('userId');

            if (checkSession) {
                let user = checkSession.userId;
                if (user && !user.isBlocked) {
                    return { status: 'ok', user }
                }
                else {
                    return { status: 'nok' }
                }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
            return { status: 'nok' };
        }
    },

    deleteSessions: async (sessionId) => {
        try {
            await collection.sessionCollection.deleteOne({ sessionId: sessionId })
            return { status: 'deleted' }
        }
        catch (err) {
            console.log(err)
        }
    },
}