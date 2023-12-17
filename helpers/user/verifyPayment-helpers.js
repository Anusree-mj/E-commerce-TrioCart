const collection = require('../../models/index-model')


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
            const currentDate = new Date()
            const data = {
                userId: user._id,
                transactions: [
                    {
                        status: "Debited",
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