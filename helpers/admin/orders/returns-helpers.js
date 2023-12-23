const collection = require('../../../models/index-model')

module.exports = {
    getAllProductReturns: async () => {
        try {
            const returns = await collection.productReturnCollection.find() .sort({ createdAt: -1 })
                .populate('orderId userId productId');
            return { returns }
        } catch (err) {
            console.log(err)
        }
    },
    updateReturnStatus: async (data) => {
        try {
            console.log('datainupdatereturnStatys', data)
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
                console.log('return update success')
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
            console.log('details', details)
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
            const currentDate = new Date()
            const data = {
                userId: user,
                transactions: [
                    {
                        status: "Credited",
                        amount: (details.order.amount) / 100,
                        createdAt: currentDate
                    }
                ]

            }
            await collection.walletCollection.insertMany([data])
            return { status: 'ok' }

        } catch (err) {
            console.log(err)
        }
    }
}



