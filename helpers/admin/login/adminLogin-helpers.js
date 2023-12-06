const collection = require('../../../models/index-model')

module.exports = {
    dologin: async (adminData) => {
        try {
            const admin = await collection.adminCollection.findOne({ email: adminData.email })
            console.log(admin)
            if (admin && admin.password === adminData.password) {
                return admin
            } else {
                console.log('no admin')
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    saveSessions: async (sessionId, adminId) => {
        try {
            const data = {
                adminId: adminId,
                sessionId: sessionId
            }
            await collection.adminSessionCollection.insertMany([data])
            console.log('session stored')
        }
        catch (err) {
            console.log(err, 'session storing failed')
        }
    },

    checkSessions: async (sessionId) => {
        try {
            const check = await collection.adminSessionCollection.findOne({
                sessionId: sessionId,
            })
            if (check) {
                let adminId = check.adminId
                return { status: 'ok', adminId }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    deleteSessions: async (sessionId) => {
        try {
            await collection.adminSessionCollection.deleteOne({ sessionId: sessionId })
            return { status: 'deleted' }
        }
        catch (err) {
            console.log(err)
        }
    },

    getAdmin: async (email) => {
        try {
            const admin = await collection.adminCollection.findOne({ email: email })
            return admin
        }
        catch (err) {
            console.log(err)
        }
    },
}