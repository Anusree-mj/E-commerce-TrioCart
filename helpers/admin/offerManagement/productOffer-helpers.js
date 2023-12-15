const collection = require('../../../models/index-model')

module.exports = {
    getProductOfferDetails: async (productId) => {
        try {
            const offerDetails = await collection.productsCollection.findOne(
                {
                    _id: productId
                },
                {
                    name: 1,
                    category: 1,
                    subCategory: 1,
                    discount: 1
                }
            )
            return offerDetails;
        } catch (err) {
            console.log(err)
        }
    },

    editOffer: async (productId, offer) => {
        try {
            console.log('productId', productId)
            const product = await collection.productsCollection.findOne({ _id: productId })

            let discountedPrice;
            discountAmount = Math.round((Number(offer) / 100) * product.price);
            if (product.offerPrice ===0) {
                discountedPrice = product.price - discountAmount;
            } else if(product.offerPrice > 0) {
                discountedPrice = product.offerPrice - discountAmount;
            }


            const updateData = await collection.productsCollection.updateOne(
                {
                    _id: productId
                },
                {
                    $set: {
                        discount: offer,
                        offerPrice: discountedPrice,
                    }
                });

            console.log('updated data is :::', updateData)
            if (updateData.modifiedCount === 1) {
                console.log('modified count', updateData.modifiedCount);
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }
    },
}