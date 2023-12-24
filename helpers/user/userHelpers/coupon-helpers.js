const collection = require('../../../models/index-model')

module.exports = {
    getCashBack: async (userId, referralCode) => {
        try {
            const checkReferralCode = await collection.usersCollection.findOneAndUpdate(
                {
                    'referralCode.name': referralCode,
                    'referralCode.isValid': true
                },
                {
                    $set: {
                        'referralCode.isValid': false,
                    }
                }
            );

            if (checkReferralCode) {
                referalCreditAmount = await collection.cashBackCollection.findOne(
                    { name: 'Referral credit' }
                );
                // cashback for referring an user
                await collection.walletCollection.updateOne(
                    {
                        userId: userId
                    },
                    {
                        $push: {
                            transactions: {
                                status: 'Credited',
                                amount: referalCreditAmount.cashBack,
                                createdAt: new Date(),
                            }
                        },
                    },
                    {
                        upsert: true,
                    }
                );

                // cashback for referred user
                referalBonusAmount = await collection.cashBackCollection.findOne(
                    { name: 'Referral bonus' }
                );
                await collection.walletCollection.updateOne(
                    {
                        userId: checkReferralCode._id
                    },
                    {
                        $push: {
                            transactions: {
                                status: 'Credited',
                                amount: referalBonusAmount.cashBack,
                                createdAt: new Date(),
                            }
                        },
                    },
                    {
                        upsert: true,
                    }
                );
                return { status: 'ok' };
            } else {
                return { status: 'nok' };
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    applyCoupon: async (userId, couponId, totalprice, cartId) => {
        try {
            const checkCouponValidity = await collection.usersCollection.findOne({
                _id: userId,
                coupon: couponId,
            });
            if (!checkCouponValidity) {
                const couponDiscount = await collection.couponCollection.findOne(
                    { _id: couponId },
                    {
                        discount: 1
                    }
                )
                const discountPercent = (Number(totalprice) * couponDiscount.discount) / 100;
                const roundedDiscount = Math.round(discountPercent);
                const discount = totalprice - roundedDiscount;

                await collection.usersCollection.updateOne(
                    { _id: userId },
                    { $push: { coupon: couponId } }
                );

                const updateCart = await collection.cartCollection.updateOne(
                    {
                        _id: cartId
                    },
                    {
                        $set: {
                            discount: discount,
                        }
                    }
                )
                return { status: 'ok', discount }
            } else {
                return { status: 'nok' }
            }

        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
}