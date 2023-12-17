const collection = require('../../../models/index-model')

module.exports = {
    getUsers: async () => {
        try {
            const users = await collection.usersCollection.find()
            return users
        }
        catch (err) {
            console.log(err)
        }
    },

    blockUser: async (userId) => {
        try {
            const user = await collection.usersCollection.updateOne(
                { _id: userId },
                {
                    $set: { isBlocked: true }
                })
            console.log('Update Result:', user);
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
    },
    unblockUser: async (userId) => {
        try {
            console.log('useridinunblick', userId)
            const user = await collection.usersCollection.updateOne(
                { _id: userId },
                {
                    $set: { isBlocked: false }
                })
            console.log('Update Result:', user);
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
    },
    getAUser: async (userId) => {
        try {
            console.log('usereieddd',userId)
            const user = await collection.usersCollection.find({
                _id: userId.trim()
            })
            return{user}
        }
        catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }
    }
}