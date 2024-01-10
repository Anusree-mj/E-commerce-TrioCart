const collection = require('../../../models/index-model')
const bcrypt = require('bcrypt')
const signupUtil = require('../../../utils/signupUtil');
const referralCodeUtil = require('../../../utils/referralCode');
const { updateOne } = require('../../../models/order-model');

let referralCreditCount = 0;

module.exports = {
    doSignup: async (userData, otp) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email })
            if (user) {
                return { status: 'same email' }
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                console.log('referred codeee',userData.referal)
                const data = {
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    password: userData.password,
                    referredCode:userData.referal,
                    otp: otp
                }
                const email = userData.email
                await collection.tempUsersCollection.insertMany([data])
                await signupUtil.sendOtpByEmail(userData.email, otp);
                return { status: 'ok', email }

            }
        } catch (err) {
            console.log(err)
        }
    },

    doVerifyUser: async (data) => {
        try {

            const check = await collection.tempUsersCollection.findOne({ otp: data.otp });
            if (check) {
                const getReferralCode = referralCodeUtil.generateReferralCode(check.name);

                const updateData = {
                    name: check.name,
                    phone: check.phone,
                    email: check.email,
                    referredCode:check.referredCode,
                    password: check.password,
                    'referralCode.name': getReferralCode,
                    coupon: [
                        {
                            name: 'Referral Credit',
                             count: referralCreditCount
                        }
                    ]
                }
                await collection.usersCollection.insertMany(updateData)
                const user = await collection.usersCollection.findOne({ email: check.email });
                await collection.tempUsersCollection.findOneAndUpdate(
                    { email: user.email },
                    { $set: { userId: user._id } }
                );
                if (user) {
                    return { user }
                }
            }
        } catch (err) {
            console.log(err)
        }
    },

    dologin: async (userData) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email });
            if (user) {
                const passwordMatch = await bcrypt.compare(userData.password, user.password);
                if (passwordMatch) {
                    if (!user.isBlocked) {
                        return { user };
                    } else {
                        return { status: 'blocked' };
                    }
                } else {
                    return { status: 'invalid' };
                }
            } else {
                return { status: 'invalid' };
            }
        } catch (err) {
            console.log(err);
            return { status: 'error' };
        }
    },
}