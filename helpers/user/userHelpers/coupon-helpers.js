const collection = require('../../../models/index-model')

module.exports = {
      applyCoupon: async (userId, couponId, totalprice, cartId) => {
        try {
            console.log('couponId', couponId)
            console.log('typeoftotalprice', typeof totalprice)
            const checkCouponValidity = await collection.usersCollection.findOne({
                _id: userId,
                coupon: couponId,
            });
            console.log('checkingcoupon', checkCouponValidity)
            if (!checkCouponValidity) {
                console.log('entered in if')
                const couponDiscount = await collection.couponCollection.findOne(
                    { _id: couponId },
                    { discount: 1 }
                )
                console.log('coupon form coupon collection', couponDiscount.discount)
                console.log('totalprice', totalprice)
                const discountPercent = (Number(totalprice) * couponDiscount.discount) / 100;
                const roundedDiscount = Math.round(discountPercent);
                const discount = totalprice - roundedDiscount;

                console.log('roundedDiscount', roundedDiscount);
                console.log('discount', discount);

                await collection.usersCollection.updateOne(
                    { _id: userId },
                    { $push: { coupon: couponId } }
                );
                
                // console.log('cartiddd', cartId)
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