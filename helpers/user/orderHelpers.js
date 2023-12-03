const collection = require('../../models')

const delvryTimeUtil = require('../../utils/delvryTymUtil');

module.exports = {
    saveOrderAddress: async (userId, billingAddress) => {
        try {
            const updateData = await collection.usersCollection.updateOne(
                { _id: userId },
                {
                    $set: {
                        orderAddress: {
                            name: billingAddress.name,
                            phone: billingAddress.phone,
                            address: billingAddress.address,
                            town: billingAddress.town,
                            pincode: billingAddress.pincode,
                            state: billingAddress.state,
                        }
                    }
                })
            if (updateData.modifiedCount === 1) {
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                console.log('Data update failed')
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    saveOrderDetails: async (orderDetails) => {
        try {
            const getBillingAddress = await collection.usersCollection.findOne({
                _id: orderDetails.userId
            })
            const address = getBillingAddress.orderAddress[0];
            console.log('address in orders', address)
            // 
            const getOrderedProducts = await collection.cartCollection.findOne({
                userId: orderDetails.userId
            })
            const products = getOrderedProducts.products;


            const orderPlacementDate = new Date();
            const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(orderPlacementDate)

            const data = {
                userId: orderDetails.userId,

                billingAddress: [{
                    name: address.name,
                    phone: address.phone,
                    address: address.address,
                    town: address.town,
                    pincode: address.pincode,
                    state: address.state,
                }],

                products: products.map(product => ({
                    product: product.product,
                    Size: product.Size,
                    Count: product.Count,
                })),

                paymentMethod: orderDetails.paymentMethod,
                estimatedDelivery: deliveryTym,
                totalAmount: orderDetails.total,
            }
            console.log('inserted data in orders ', data)

            await collection.orderCollection.insertMany([data])
            await collection.cartCollection.deleteOne({
                userId: orderDetails.userId
            })
            return { status: 'ok' }

        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    getAllOrderDetails: async (userId) => {
        try {
            const orderDetails = await collection.orderCollection.find({
                userId: userId
            }).sort({ createdAt: -1 }).populate('products.product');

            const latestOrder = orderDetails[0];
            const estimatedDelivery = latestOrder.estimatedDelivery;

            return { status: 'ok', orderDetails, estimatedDelivery, latestOrder }

        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    getAnOrder: async (orderId) => {
        try {
            const order = await collection.orderCollection.findOne({
                _id: orderId
            }).populate('products.product');
            return { order }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
}