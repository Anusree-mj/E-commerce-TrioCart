const collection = require('../../../models/mongodb')
const bcrypt = require('bcrypt');

module.exports = {
    updateUser: async (userId, data) => {
        try {
            const user = await collection.usersCollection.updateOne(
                { _id: userId },
                {
                    name: data.name,
                    phone: data.phone,
                    email: data.email
                }
            )
            if (user.modifiedCount === 1) {
                console.log('user data updated');
                return { status: 'ok' }
            } else {
                console.log('user data update failed');
            }
        } catch (err) {
            console.log(err)
        }
    },
    changePassword: async (data) => {
        try {
            const user = await collection.usersCollection.findOne({ _id: data.userId });
            const passwordMatch = await bcrypt.compare(data.currentPassword, user.password);

            if (passwordMatch) {
                password = await bcrypt.hash(data.password, 10)
                await collection.usersCollection.updateOne(
                    { _id: data.userId },
                    { $set: { password: password } })
                    return{status:'ok'}
            }else{
                return{status:'nok'}
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    updatePassword: async (email, password) => {
        try {
            password = await bcrypt.hash(password, 10)
            const user = await collection.usersCollection.updateOne(
                { email: email },
                { $set: { password: password } })
            if (user) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },
}