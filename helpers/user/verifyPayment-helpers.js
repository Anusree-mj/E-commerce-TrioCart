const collection = require('../../models/index-model')


module.exports = {
    savePaymentDetails: async (details, user) => {
        try {
            await collection.cartCollection.deleteOne({
                userId: user._id
            })
          const updateDate = await collection.orderCollection.updateOne(
            {  _id:details.order.receipt},
            {$set: {orderStatus:'placed'}}
            )

            const data = {
                userId: user._id,
                orderId: details.order.receipt,
                amount: (details.order.amount) / 100,
            }
            await collection.paymentCollection.insertMany([data])           
            return { status: 'ok' }

        } catch (err) {
            console.log(err)
        }
    }
}