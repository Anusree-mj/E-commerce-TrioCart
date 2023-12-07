const collection = require('../../models/index-model')

const delvryTimeUtil = require('../../utils/delvryTymUtil');
const userReadableIdUtil = require('../../utils/userReadableId');

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

            const getOrderedProducts = await collection.cartCollection.findOne({
                userId: orderDetails.userId
            })

            const products = getOrderedProducts.products;
            const orderPlacementDate = new Date();
            const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(
                orderPlacementDate, 'placed')

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
                orderStatus: (orderDetails.paymentMethod === 'onlinePayment' ? 'pending' : "placed")
            }
            console.log('inserted data in orders ', data)

            const orderDocument = new collection.orderCollection(data);
            // Save the order to the database
            await orderDocument.save();
            // Retrieve the inserted order ID
            const orderId = orderDocument._id;
            console.log('orderId', orderId);

            const totalAmount = orderDetails.total;
            if (orderDetails.paymentMethod !== 'onlinePayment') {
                await collection.cartCollection.deleteOne({
                    userId: orderDetails.userId
                })
            }
            return { status: 'ok', orderId, totalAmount }

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
            const userReadableOrderId = await userReadableIdUtil.generateUserReadableId(orderId)

            const order = await collection.orderCollection.findOne({
                _id: orderId
            }).populate('products.product');
            return { order, userReadableOrderId }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    cancelAnOrder: async (orderId) => {
        try {
            const updateData = await collection.orderCollection.updateOne(
                { _id: orderId },
                { $set: { orderStatus: 'Cancelled by User' } }
            )
            if (updateData.modifiedCount === 1) {
                console.log('order update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
,  returnProduct: async (productId,details) => {
    try {
        let amount=details.count * details.price;        
        const data = {
            productId: productId,
            totalAmount: amount,
            size: details.size,
            returnStatus: 'placed'           
        }      
        await collection.productReturnCollection.insertMany([data]) 
        await collection.orderCollection.updateOne(
            {
                _id: details.orderId,
                'products.product': productId,
            },
            {
                $set:{
                    'products.$.isReturned': true,
                }
            }
            )
        
        return { status: 'ok'}
    } catch (err) {
        console.log(err);
        return { status: 'nok' };
    }
}

}

