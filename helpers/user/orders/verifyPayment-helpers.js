const collection = require('../../../models/index-model')


module.exports = {
    savePaymentDetails: async (details, user) => {
        try {
            await collection.cartCollection.deleteOne({
                userId: user._id
            })
            await collection.orderCollection.updateOne(
                { _id: details.order.receipt },
                { $set: { orderStatus: 'placed' } }
            )
            await collection.walletCollection.updateOne(
                {
                    userId: user._id,
                },
                {
                    $push: {
                        transactions: {
                            status: "Debited",
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