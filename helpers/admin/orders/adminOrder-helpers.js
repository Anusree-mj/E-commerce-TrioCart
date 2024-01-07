const collection = require('../../../models/index-model')
const delvryTimeUtil = require('../../../utils/delvryTymUtil');
const schedule = require('node-schedule');

module.exports = {
    getAllOrders: async () => {
        try {
            const orders = await collection.orderCollection
                .find()
                .sort({ createdAt: -1 })
                .populate('userId')
                .populate('products.product');
            return { orders }
        }
        catch (err) {
            console.log(err)
        }
    },
    getAllOrdersGraph: async () => {
        try {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const orders = await collection.orderCollection.aggregate([
                {
                    $match: {
                        createdAt: { 
                            $gte: new Date(currentYear, currentMonth - 1, 1),
                            $lt: new Date(currentYear, currentMonth, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        totalCount: { $sum: 1 },
                        totalPrice: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                        "_id.day": 1
                    }
                }

            ]);
            return { orders }
        }
        catch (err) {
            console.log(err)
        }
    },

    getTotalCounts: async () => {
        try {
            const userCounts = await collection.usersCollection.countDocuments();
            const totalOrders = await collection.orderCollection.countDocuments();

            const orderCountsCursor = await collection.orderCollection.aggregate([
                {
                    $group: {
                        _id: null,
                        shippedCount: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$orderStatus", "shipped"] }, then: 1, else: 0
                                }
                            }
                        },
                        deliveredCount: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$orderStatus", "delivered"] }, then: 1, else: 0
                                }
                            }
                        },
                        placedCount: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$orderStatus", "placed"] }, then: 1, else: 0
                                }
                            }
                        }
                    }
                }
            ])

            if (orderCountsCursor.length > 0) {
                const { shippedCount, deliveredCount, placedCount } = orderCountsCursor[0];

                const yetToBeShippedCount = placedCount - shippedCount;

                return { yetToBeShippedCount, deliveredCount, totalOrders, userCounts };
            }
            else {
                return { shippedCount: 0, deliveredCount: 0, placedCount: 0, userCounts };
            }

        } catch (err) {
            console.log(err)
        }
    },

    updateOrderStatus: async (data) => {
        try {
            if (data.status !== 'delivered' && data.status !== 'cancelled by seller') {
                const orderPlacementDate = new Date();
                const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(orderPlacementDate, data.status)

                const updateData = await collection.orderCollection.updateOne(
                    { _id: data.orderId },
                    { $set: { orderStatus: data.status, estimatedDelivery: deliveryTym, } }
                )

                if (updateData.modifiedCount === 1) {
                    return { status: 'ok' }
                } else {
                    return { status: 'nok' }
                }
            }
            else if (data.status === 'delivered') {
                const orderPlacementDate = new Date();
                const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(orderPlacementDate, data.status)

                const updateData = await collection.orderCollection.updateOne(
                    { _id: data.orderId },
                    {
                        $set: {
                            orderStatus: data.status,
                            deliveredDate: deliveryTym.deliveryDateString,
                            returnDate: deliveryTym.returnDateString,
                            returnValid: true,
                        }
                    }
                )

                if (updateData.modifiedCount === 1) {
                    return { status: 'ok' }
                } else {
                    return { status: 'nok' }
                }
            } else {

                const updateData = await collection.orderCollection.updateOne(
                    { _id: data.orderId },
                    { $set: { orderStatus: data.status } }
                )

                if (updateData.modifiedCount === 1) {
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
    },

    // for expiring return status
    scheduleReturnValidUpdate: () => {
        const rule = new schedule.RecurrenceRule();
        rule.hour = 0;
        rule.minute = 0;

        schedule.scheduleJob(rule, async () => {
            try {
                const currentDate = new Date();

                const orders = await collection.orderCollection.find({ returnValid: true }).toArray();
                const modifiedReturnDates = orders.map(order => {
                    return new Date(order.returnDate);
                });

                const updateResult = await collection.orderCollection.updateMany(
                    {
                        returnValid: true,
                        modifiedReturnDates: { $lt: currentDate },
                    },
                    {
                        $set: { returnValid: false },
                    }
                );
            } catch (error) {
                console.error('Error updating returnValid:', error);
            }
        });
    },
}
