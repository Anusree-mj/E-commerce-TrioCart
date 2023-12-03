const collection = require('../../../models')

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
            const updateData = await collection.orderCollection.updateOne(
                { _id: data.orderId },
                { $set: { orderStatus: data.status } }
            )

            if (updateData.modifiedCount === 1) {
                console.log('order update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
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
