const collection = require('../../../models/index-model')
const signupUtil = require('../../../utils/signupUtil');
const cronFnctn = require('../../../utils/cron');

module.exports = {
    getOtp: async (email, otp) => {
        try {
            const otpExpiryTime = new Date();
            otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 1.5);
            const user = await collection.tempUsersCollection.updateOne(
                { email: email },
                {
                    $set: {
                        otp: otp,
                        otpExpiryTime: otpExpiryTime,
                        otpExpired: false,
                    }
                }
            )
            if (user) {
                await signupUtil.sendOtpByEmail(email, otp)
                cronFnctn.expireOTP();
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
            const user = await collection.tempUsersCollection.findOne({
                email: email,
                otp: otp,
                otpExpired: false
            });
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