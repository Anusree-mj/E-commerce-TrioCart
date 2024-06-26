const collection = require('../../../models/index-model')
const delvryTimeUtil = require('../../../utils/delvryTymUtil');
const userReadableIdUtil = require('../../../utils/userReadableId');
const cashBackHelper = require('../userHelpers/coupon-helpers')
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
                return { status: 'ok' }
            } else {
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

            // updating stock
            const updateStock = products.map(async (product) => {
                await collection.productsCollection.updateOne(
                    {
                        _id: product.product,
                        'sizesStock.size': product.Size
                    },
                    { $inc: { 'sizesStock.$.count': -1 } }
                )
            });
            await Promise.all(updateStock);
            if (updateStock) {
            }
            // get estimated delivery time
            const orderPlacementDate = new Date();
            const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(
                orderPlacementDate, 'placed')

            // discount percenteage
            const orderValue = orderDetails.totalPrice;
            const originalAmount = orderDetails.total;
            const amountDifference = orderValue - originalAmount;
            const discountPercentage = amountDifference !== 0 ? Math.round((amountDifference / orderValue) * 100) : 0;
            // update details in order collection
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
                orderValue: orderDetails.totalPrice,
                discount: discountPercentage,
                orderStatus: (orderDetails.paymentMethod === 'onlinePayment' ? 'pending' : "placed")
            }

            const orderDocument = new collection.orderCollection(data);
            // Save the order to the database
            await orderDocument.save();
            // Retrieve the inserted order ID
            const orderId = orderDocument._id;

            const totalAmount = orderDetails.total;
            // delete ordered products from cartcollection if not online paymetn
            if (orderDetails.paymentMethod !== 'onlinePayment') {
                await collection.cartCollection.deleteOne({
                    userId: orderDetails.userId
                })
            }
             // give cashback if any
             const checkCashback = await collection.orderCollection.find({
                userId: orderDetails.userId
            });
            
            if (checkCashback.length === 1) {
                const referredCode = getBillingAddress.referredCode;
                await cashBackHelper.getCashBack(orderDetails.userId, referredCode);
            } 
            return { status: 'ok', orderId, totalAmount }

        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    getAllOrderDetails: async (userId, skip, limit) => {
        try {
            const orderDetails = await collection.orderCollection
                .find({ userId: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('products.product');

            if (orderDetails) {
                const latestOrder = orderDetails[0];
                const estimatedDelivery = latestOrder.estimatedDelivery;

                return { status: 'ok', orderDetails, estimatedDelivery, latestOrder };
            } else {
                return { status: 'ok' };
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    getTotalOrderCount: async (userId) => {
        try {
            const totalOrders = await collection.orderCollection.countDocuments({ userId });
            return { status: 'ok', totalOrders };
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
            const orderDetails = await collection.orderCollection.findOne(
                {
                    _id: orderId,
                }
            )

            // update stock
            const updateStock = orderDetails.products.map(async (item) => {
                const productId = item.product;
                const size = item.Size;
                await collection.productsCollection.updateOne(
                    {
                        _id: productId,
                        'sizesStock.size': size
                    },
                    { $inc: { 'sizesStock.$.count': 1 } }
                );
            });

            await Promise.all(updateStock);

            const updateData = await collection.orderCollection.updateOne(
                { _id: orderId },
                { $set: { orderStatus: 'Cancelled by User' } }
            )
            if (updateData.modifiedCount === 1) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    returnProduct: async (productId, details, userID) => {
        try {
            const updateStock = await collection.productsCollection.updateOne(
                {
                    _id: productId,
                    'sizesStock.size': (details.size).trim()
                },
                { $inc: { 'sizesStock.$.count': 1 } }
            )

            let amount = details.count * details.price;
            const data = {
                orderId: details.orderId,
                userId: userID,
                productId: productId,
                totalAmount: amount,
                size: details.size,
                returnReason: details.reason,
                returnStatus: 'placed'
            }
            await collection.productReturnCollection.insertMany([data])
            await collection.orderCollection.updateOne(
                {
                    _id: details.orderId,
                    'products.product': productId,
                },
                {
                    $set: {
                        'products.$.isReturned': true,
                    }
                }
            )

            return { status: 'ok' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }

}