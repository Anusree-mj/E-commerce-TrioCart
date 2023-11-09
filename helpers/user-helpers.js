const collection = require('../routes/mongodb')
const bcrypt = require('bcrypt')
module.exports = {
    doSignup: async (userData) => {
        try {
            userData.password = await bcrypt.hash(userData.password, 10)
            const data = {
                name: userData.name,
                phone: userData.phone,
                email: userData.email,
                address: userData.address,
                password: userData.password
            }
            await collection.usersCollection.insertMany([data])
            return { status: 'ok' }
        } catch (err) {
            console.log(err)
            return { status: 'nok' }
        }
    },
    dologin: async (userData) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email })
            console.log(user)
            if (user) {
                const status = await bcrypt.compare(userData.password, user.password)
                if (status) {
                    console.log('login success')
                    return user
                } else {
                    console.log('login failed')
                }

            } else {
                console.log('no user')
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}