const collection = require('../../../../models/index-model');

module.exports = {
    getSalesCountBasedOnWeak: async (start, end) => {
        try {
            console.log('start:', start, "end:", end)
            const orders = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $gte: [
                                        { $year: "$createdAt" },
                                        start.getFullYear()
                                    ]
                                },
                                {
                                    $lte: [
                                        { $year: "$createdAt" },
                                        end.getFullYear()
                                    ]
                                },
                                {
                                    $gte: [
                                        { $month: "$createdAt" },
                                        start.getMonth() + 1
                                    ]
                                },
                                {
                                    $lte: [
                                        { $month: "$createdAt" },
                                        end.getMonth() + 1
                                    ]
                                },
                                {
                                    $gte: [
                                        { $dayOfMonth: "$createdAt" },
                                        start.getDate()
                                    ]
                                },
                                {
                                    $lte: [
                                        { $dayOfMonth: "$createdAt" },
                                        end.getDate()
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrder: { $sum: 1 },
                        totalPrice: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$paymentMethod", "onlinePayment"] },
                                    then: "$totalAmount",
                                    else: 0
                                }
                            }
                        },
                    }
                }
            ]);

            const sales = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $gte: [
                                        { $year: "$updatedAt" },
                                        start.getFullYear()
                                    ]
                                },
                                {
                                    $lte: [
                                        { $year: "$updatedAt" },
                                        end.getFullYear()
                                    ]
                                },
                                {
                                    $gte: [
                                        { $month: "$updatedAt" },
                                        start.getMonth() + 1
                                    ]
                                },
                                {
                                    $lte: [
                                        { $month: "$updatedAt" },
                                        end.getMonth() + 1
                                    ]
                                },
                                {
                                    $gte: [
                                        { $dayOfMonth: "$updatedAt" },
                                        start.getDate()
                                    ]
                                },
                                {
                                    $lte: [
                                        { $dayOfMonth: "$updatedAt" },
                                        end.getDate()
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDelivery: {
                            $sum: {
                                $cond: {
                                    if:
                                    {
                                        $eq: ["$orderStatus", "delivered"]
                                    },
                                    then: 1, else: 0
                                }
                            }
                        },
                        totalPrice: {
                            $sum: {
                                $cond: {
                                    if:
                                    {
                                        $eq: ["$orderStatus", "delivered"]
                                    },
                                    then: "$totalAmount", else: 0
                                }
                            }
                        },
                    }
                }
            ]);

            const totalSalesAmount = (orders.length > 0 ? orders[0].totalPrice : 0)
                + (sales.length > 0 ? sales[0].totalPrice : 0);

            const dailySales = [...orders, ...sales];
            return { dailySales, totalSalesAmount }
        }
        catch (err) {
            console.log(err)
        }
    },

    getSalesBasedOnWeak: async (start, end) => {
        try {
            const sales = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                $expr: {
                                    $and: [
                                        {
                                            $gte: [
                                                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                                { $dateToString: { format: "%Y-%m-%d", date: start } }
                                            ]
                                        },
                                        {
                                            $lte: [
                                                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                                { $dateToString: { format: "%Y-%m-%d", date: end } }
                                            ]
                                        },

                                        { $eq: ["$orderStatus", "delivered"] }
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $and: [
                                        {
                                            $gte: [
                                                { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                                                { $dateToString: { format: "%Y-%m-%d", date: start } }
                                            ]
                                        },
                                        {
                                            $lte: [
                                                { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                                                { $dateToString: { format: "%Y-%m-%d", date: end } }
                                            ]
                                        },

                                        { $eq: ["$orderStatus", "delivered"] }
                                    ]
                                }

                            }
                        ]
                    }
                },
                {
                    $unwind: "$products"
                },
                {
                    $group: {
                        _id: "$products.product",
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        productName: "$productDetails.name",
                        productPrice: "$productDetails.price",
                        orderStatus: "$orderStatus",
                        count: 1
                    }
                }
            ]);

            console.log('aggreagation in sales0', sales)

            return sales
        } catch (err) {
            console.log(err)
        }
    }
}