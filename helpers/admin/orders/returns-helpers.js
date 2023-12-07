const collection = require('../../../models/index-model')

module.exports = {
    getAllProductReturns: async () => {
        try {
            const returns = await collection.productReturnCollection.find()
            .populate('orderId userId productId');
            return { returns }
        } catch (err) {
            console.log(err)
        }
    },
    updateReturnStatus: async (data)=>{
        try{
            console.log('datainupdatereturnStatys',data)
            const updateData = await collection.productReturnCollection.updateOne(
                { _id: data.returnId.trim() },
                { $set: { returnStatus: 'confirmed' } }
            )
            await collection.orderCollection.updateOne(
                { _id: data.orderId.trim() },
                { $set: { orderStatus: 'returned' } }
            )
            
            if (updateData.modifiedCount === 1) {
                console.log('return update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }catch (err) {
            console.log(err)
        }
    }
    
}
