const collection = require('../../models/mongodb')
const bcrypt = require('bcrypt')
const signupUtil = require('../../utils/signupUtil');

module.exports = {
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
deleteOtp: async (email) => {
    try {
        const user = await collection.tempUsersCollection.updateOne(
            { email: email },
            { $unset: { otp: 1 } }
        )
        if (user.modifiedCount === 1) {
            console.log('otp delete success');
        } else {
            console.log('otp delete failed');
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
}