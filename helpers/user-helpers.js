const collection = require('../routes/mongodb')
const bcrypt = require('bcrypt')
const signupUtil = require('../utils/signupUtil');
module.exports = {
    doSignup: async (userData, otp) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email })
            if (user) {
                return { status: 'same email' }
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                const data = {
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    address: userData.address,
                    password: userData.password,
                    otp: otp
                }
                await collection.tempUsersCollection.insertMany([data])
                await signupUtil.sendOtpByEmail(userData.email, otp);
                return { status: 'ok' }
            }
        } catch (err) {
            console.log(err)
        }
    },
    doVerifyUser: async (data) => {
        try {
            const user = await collection.tempUsersCollection.findOne({ otp: data.otp });
            if (user) {
                const data = {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    address: user.address,
                    password: user.password
                }
                await collection.usersCollection.insertMany([data])
                return user
            }
        } catch (err) {
            console.log(err)
        }
    },
    dologin: async (userData) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email })
            console.log("user in dologin", user)
            if (!user.isBlocked) {
                const password = await bcrypt.compare(userData.password, user.password)
                if (password) {
                    return user
                } else {
                    return { status: 'invalid' }
                }
            } else {
                return { status: 'blocked' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    saveSessions: async (sessionId, userId) => {
        try {
            const data = {
                userId: userId,
                sessionId: sessionId
            }
            await collection.sessionCollection.insertMany([data])
            console.log('session stored')
        }
        catch (err) {
            console.log(err, 'session storing failed')
        }
    },
    checkSessions: async (sessionId) => {
        try {
            const checkSession = await collection.sessionCollection.findOne({
                sessionId: sessionId,
            })
            console.log("check seesssionnnn :", checkSession)
            if (checkSession) {
                let email = checkSession.userId;
                console.log("userid in checksession", email)
                const userValidity = await collection.usersCollection.findOne({ email: email });
                if (!userValidity.isBlocked) {
                    return { status: 'ok', email }
                } else {
                    console.log('user is blocked')
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
    getUser: async (email) => {
        try {
            const user = await collection.usersCollection.findOne({ email: email })
            return user
        }
        catch (err) {
            console.log(err)
        }
    },
    getOtp: async (email, otp) => {
        try {
            const user = await collection.tempUsersCollection.updateOne(
                { email: email },
                { $set: { otp: otp } }
            )
            if (user) {
                await signupUtil.sendOtpByEmail(email, otp)
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    verifyOtp: async (email, otp) => {
        try {
            const user = await collection.tempUsersCollection.findOne({ email: email, otp: otp });
            if (user) {
                return { user, status: "ok" }
            } else {
                return { status: 'nok' }
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
    getCategoryDetails: async () => {
        try {
            const allCategories = await collection.categoryCollection.find()
            return allCategories
        }
        catch (err) {
            console.log(err)
        }
    }
}