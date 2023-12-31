const collection = require('../../../models/index-model')

module.exports = {
    getAllProductReturns: async () => {
        try {
            const returns = await collection.productReturnCollection.find().sort({ createdAt: -1 })
                .populate('orderId userId productId');
            return { returns }
        } catch (err) {
            console.log(err)
        }
    },
    updateReturnStatus: async (data) => {
        try {
            const updateData = await collection.productReturnCollection.updateOne(
                { _id: data.returnId.trim() },
                { $set: { returnStatus: data.status } }
            );

            await collection.orderCollection.updateOne(
                {
                    _id: data.orderId.trim(),
                    'products.product': data.productId
                },
                {
                    $set: {
                        'products.$.returnStatus': data.status,
                    }
                }
            )

            if (updateData.modifiedCount === 1) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err)
        }
    },

    savePaymentDetails: async (details, user) => {
        try {
            await collection.productReturnCollection.updateOne(
                { _id: details.order.receipt },
                { $set: { refundStatus: 'completed' } }
            )
            await collection.orderCollection.updateOne(
                {
                    _id: details.order.receipt,
                    'products.product': details.productId
                },
                {
                    $set: {
                        'products.$.returnStatus': 'Completed',
                    }
                }
            )
            await collection.productsCollection.updateOne(
                {
                    _id: details.productId,
                    'sizesStock.size': details.Size
                },
                { $inc: { 'sizesStock.$.count': 1 } }
            )
            await collection.walletCollection.updateOne(
                {
                    userId: user,
                },
                {
                    $push: {
                        transactions: {
                            status: "Credited",
                            amount: (details.order.amount) / 100,
                            createdAt: new Date(),
                        }
                    },
                },
                {
                    upsert: true,
                }
            );

            return { status: 'ok' }

        } catch (err) {
            console.log(err)
        }
    }
}



