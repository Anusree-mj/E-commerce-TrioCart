const collection = require('../routes/mongodb')

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
    getUsers: async () => {
        try {
            const users = await collection.usersCollection.find()
            return users
        }
        catch (err) {
            console.log(err)
        }
    },
    getUserforupdate: async (userId) => {
        try {
            const user = await collection.usersCollection.find({ _id: userId })
            if (user) {
                return user
            } else {
                console / log('error')
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    blockOrUnblockUser: async (userId,userStatus) => {
        try {
            const user = await collection.usersCollection.updateOne(
                { _id: userId },
                {
                    $set: { isBlocked: userStatus }
                })
            if (user.modifiedCount === 1) {
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }
    }


}
