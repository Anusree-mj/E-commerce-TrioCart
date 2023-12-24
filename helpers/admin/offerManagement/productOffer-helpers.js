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
                    productOffer: 1
                }
            )
            return offerDetails;
        } catch (err) {
            console.log(err)
        }
    },

    editOffer: async (productId, offer) => {
        try {
            let discountedPrice;
            const product = await collection.productsCollection.findOne({ _id: productId })
            let discountAmount = Math.round((Number(offer) / 100) * product.price);
            if (offer !== '0') {
                if (product.offerPrice === 0) {
                    discountedPrice = product.price - discountAmount;
                } else if (product.offerPrice > 0) {
                    discountedPrice = product.offerPrice - discountAmount;
                }
                await collection.productsCollection.updateOne(
                    {
                        _id: productId
                    },
                    {
                        $set: {
                            productOffer: offer,
                            offerPrice: discountedPrice,
                        }
                    });
            }
            else {
                if (product.categoryOffer === 0) {
                    discountedPrice = 0;
                } else {
                    discountAmount = Math.round((Number(product.categoryOffer) / 100) * product.price)
                    discountedPrice = product.price - discountAmount;
                }
                await collection.productsCollection.updateOne(
                    {
                        _id: productId
                    },
                    {
                        $set: {
                            productOffer: offer,
                            offerPrice: discountedPrice,
                        }
                    });
            }
            return { status: 'ok' }


        } catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }
    },
}