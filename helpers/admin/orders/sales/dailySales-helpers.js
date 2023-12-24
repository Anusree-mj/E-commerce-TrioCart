const collection = require('../../../../models/index-model');

module.exports = {
    getSalesCountBasedOnDay: async (day) => {
        try {
            const orders = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $year: { $toDate: "$createdAt" } }, day.getFullYear()] },
                                { $eq: [{ $month: { $toDate: "$createdAt" } }, day.getMonth() + 1] },
                                { $eq: [{ $dayOfMonth: { $toDate: "$createdAt" } }, day.getDate()] },
                                { $eq: ["$paymentMethod", "onlinePayment"] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrder: { $sum: 1 },
                        totalPrice: {
                            $sum: "$totalAmount"
                        },
                    }
                }
            ]);

            const sales = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $year: "$updatedAt" }, day.getFullYear()] },
                                { $eq: [{ $month: "$updatedAt" }, day.getMonth() + 1] },
                                { $eq: [{ $dayOfMonth: "$updatedAt" }, day.getDate()] },
                                { $eq: ["$orderStatus", "delivered"] },
                                { $eq: ["$paymentMethod", "COD"] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDelivery: {
                            $sum: 1,
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
    getSalesBasedOnDay: async (day) => {
        try {
            const sales = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $year: "$createdAt" }, day.getFullYear()] },
                                        { $eq: [{ $month: "$createdAt" }, day.getMonth() + 1] },
                                        { $eq: [{ $dayOfMonth: "$createdAt" }, day.getDate()] },
                                        { $eq: ["$paymentMethod", "onlinePayment"] }
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $year: "$updatedAt" }, day.getFullYear()] },
                                        { $eq: [{ $month: "$updatedAt" }, day.getMonth() + 1] },
                                        { $eq: [{ $dayOfMonth: "$updatedAt" }, day.getDate()] },
                                        { $eq: ["$orderStatus", "delivered"] },
                                        { $eq: ["$paymentMethod", "COD"] }
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
            return sales
        } catch (err) {
            console.log(err)
        }
    }
}