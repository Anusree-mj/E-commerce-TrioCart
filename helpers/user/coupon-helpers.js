const collection = require('../../models/index-model')

module.exports = {
    addCoupon: async (userId, referralCode) => {
        try {
            console.log('udsfafe', userId)
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
                            couponAmount: 10
                        }
                    }

                }
            )
            if (checkReferralCode) {
                const applyingCoupon = await collection.usersCollection.findOneAndUpdate(
                    {
                        _id: userId
                    },
                    {
                        $push: {
                            coupon: {
                                name: 'Referral Credit',
                                couponAmount: 5
                            }
                        },


                    }
                )
                console.log('coupon appliead or not', applyingCoupon)
                if (applyingCoupon) {
                    return { status: 'ok' }
                }
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    applyCoupon: async (userId, couponName, totalprice, cartId) => {
        try {
            console.log('typeoftotalprice', typeof totalprice)
            const checkCouponValidity = await collection.usersCollection.findOne(
                {
                    _id: userId,
                    coupon: {
                        $elemMatch: {
                            name: couponName,
                            isApplicable: true,
                        }
                    }
                },
                {
                    'coupon.$': 1
                }
            )
            console.log('checkingcoupon', checkCouponValidity)
            // console.log('couponamount', checkCouponValidity.coupon[0].couponAmount)
            if (checkCouponValidity) {

                const discountPercent = (Number(totalprice) * checkCouponValidity.coupon[0].couponAmount) / 100;
                const roundedDiscount = Math.round(discountPercent);
                const discount = totalprice - roundedDiscount;

                // console.log('roundedDiscount', roundedDiscount);
                // console.log('discount', discount);

                await collection.usersCollection.updateOne(
                    {
                        _id: userId,
                        coupon: {
                            $elemMatch: {
                                name: couponName
                            }
                        }
                    },
                    {
                        $set: {
                            'coupon.$.isApplicable': false
                        }
                    }
                )
                console.log('cartiddd', cartId)
                const updateCart = await collection.cartCollection.updateOne(
                    {
                        _id: cartId
                    },
                    {
                        $set: { discount: discount } 
                    }
                )
                // console.log('updatecart',updateCart)
                console.log('coupon applied successfully')
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