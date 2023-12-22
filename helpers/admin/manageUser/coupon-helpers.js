const collection = require('../../../models/index-model')

module.exports={
    getAllCoupons:async()=>{
        const coupons= await collection.couponCollection.find().sort({ createdAt: -1 });

        return coupons
    },

    addCoupon:async(data)=>{
        const insertData = {
            name: data.name,
            description: data.description,
            minAmount: data.amount,
            discount: data.discount,
            validityDate: data.validDate           
        };
        await collection.couponCollection.insertMany([insertData]);
        return { status: 'ok' }
    }

}