const collection = require('../../models/index-model')
const bcrypt = require('bcrypt');
const signupUtil = require('../../utils/signupUtil');

module.exports = {
    verifyUser: async (userData, otp, userId) => {
        try {
          const updateTempUser = await collection.tempUsersCollection.updateOne(
                { email: userId },
                {
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    otp: otp
                }
            )

           if(updateTempUser){
            await signupUtil.sendOtpByEmail(userData.email, otp);
            return { status: 'ok', }
           } else{
            console.log('no matched document')
           }

        } catch (err) {
            console.log(err)
        }
    },

    updateUser: async (userId, otp) => {
        try {
            const check = await collection.tempUsersCollection.findOne({ otp: otp });
            console.log(otp,'otp')
            if (check) {
                const user = await collection.usersCollection.updateOne(
                    { _id: userId },
                    {
                        name: check.name,
                        phone: check.phone,
                        email: check.email
                    }
                )
                if (user.modifiedCount === 1) {
                    console.log('user data updated');
                    return { status: 'ok' }
                } else {
                    console.log('user data update failed');
                }
            } else {
                return { status: 'nok' }
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
                return { status: 'ok' }
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
}