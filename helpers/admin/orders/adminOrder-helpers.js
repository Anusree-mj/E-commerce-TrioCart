const collection = require('../../../models/index-model')
const delvryTimeUtil = require('../../../utils/delvryTymUtil');

module.exports = {
    getAllOrders: async () => {
        try {
            console.log('entered in order fnctn')
            const orders = await collection.orderCollection
                .find()
                .populate('userId')
                .populate('products.product');

            console.log('orders::', orders)

            return { orders }
        }
        catch (err) {
            console.log(err)
        }
    },
    updateOrderStatus: async (data) => {
        try {
            if(data.status!=='delivered' && data.status!=='cancelled by seller'){
            const orderPlacementDate = new Date();
            const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(orderPlacementDate,data.status)

            const updateData = await collection.orderCollection.updateOne(
                { _id: data.orderId },
                { $set: { orderStatus: data.status, estimatedDelivery: deliveryTym, } }
            )

            if (updateData.modifiedCount === 1) {
                console.log('order update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }else if(data.status==='delivered'){
            const orderPlacementDate = new Date();
            const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(orderPlacementDate,data.status)

            const updateData = await collection.orderCollection.updateOne(
                { _id: data.orderId },
                { $set: { orderStatus: data.status, deliveredDate: deliveryTym, } }
            )

            if (updateData.modifiedCount === 1) {
                console.log('order update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }else{
          
            const updateData = await collection.orderCollection.updateOne(
                { _id: data.orderId },
                { $set: { orderStatus: data.status} }
            )

            if (updateData.modifiedCount === 1) {
                console.log('order update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }  
        }
        }
        catch (err) {
            console.log(err)
        }
    },
    getAnOrder: async (orderId) => {
        try {
            const order = await collection.orderCollection.findOne({
                _id: orderId
            }).populate('userId')
                .populate('products.product');

            return { order }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
}
