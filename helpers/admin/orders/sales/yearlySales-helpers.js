const collection = require('../../../../models/index-model');

module.exports = {
    getSalesCountBasedOnYear: async (year) => {
        try {
            console.log('year passed', year)
            const orders = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [{ $year: "$createdAt" }, year]
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
                            $eq: [{ $year: "$updatedAt" },year]
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

    getSalesBasedOnYear: async (year) => {
        try {
            const sales = await collection.orderCollection.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $year: "$createdAt" }, year] },                                        
                                        { $eq: ["$paymentMethod", "onlinePayment"] }
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $year: "$updatedAt" }, year] },                                        
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