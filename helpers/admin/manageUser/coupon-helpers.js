const collection = require('../../../models/index-model')

module.exports = {
    getAllCoupons: async () => {
        try {
            const coupons = await collection.couponCollection.find().sort({ createdAt: -1 });

            return coupons
        } catch (err) {
            console.log(err)
        }
    },

    addCoupon: async (data) => {
        try {
            const insertData = {
                name: data.name,
                description: data.description,
                minAmount: data.amount,
                discount: data.discount,
                couponActivatingDate: data.endDate,
                couponDeactivatingDate: data.startDate,
            };
            await collection.couponCollection.insertMany([insertData]);
            return { status: 'ok' }
        } catch (err) {
            console.log(err)
        }
    },

    getACoupon: async (couponId) => {
        try {
            const coupon = await collection.couponCollection.find({
                _id: couponId
            })
            return coupon
        } catch (err) {
            console.log(err)
        }
    },

    editCoupon: async (couponId, data) => {
        try {
            const coupon = await collection.couponCollection.updateOne({
                _id: couponId
            },
                {
                    $set: {
                        name: data.name,
                        description: data.description,
                        minAmount: data.amount,
                        discount: data.discount,
                        couponActivatingDate: data.startDate,
                        couponDeactivatingDate: data.endDate,
                    }
                })
            if (coupon) {
                return { status: 'ok' }
            }
            else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err)
        }
    }

}