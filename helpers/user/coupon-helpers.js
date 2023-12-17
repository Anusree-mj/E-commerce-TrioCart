const collection = require('../../models/index-model')

module.exports = {
    addCoupon: async (userId, referralCode) => {
        try {
            console.log('udsfafe',userId)
            const checkReferralCode = await collection.usersCollection.findOneAndUpdate(
                {
                    'referralCode.name': referralCode,
                    'referralCode.isValid': true
                },
                {
                    $set: {
                        'referralCode.isValid': false,
                    },
                    $push: {
                        coupon: {
                            name: 'Referral Bonus',
                            count: 1
                        }
                    }

                }
            )
            if (checkReferralCode) {
             const applyingCoupon=   await collection.usersCollection.findOneAndUpdate(
                    {
                        _id: userId
                    },
                    {
                        $push: {
                            coupon: {
                                name: 'Referral Credit',
                                count: 1
                            }
                        },
                       

                    }
                )
                console.log('coupon appliead or not',applyingCoupon)
                if(applyingCoupon){
                    return { status: 'ok' }
                }               
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
}