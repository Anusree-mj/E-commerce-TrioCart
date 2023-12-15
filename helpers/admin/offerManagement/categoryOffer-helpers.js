const collection = require('../../../models/index-model')

module.exports = {
    getCategoryOfferDetails: async (subcategory, category) => {
        try {
            const offerDetails = await collection.categoryCollection.findOne(
                {
                    category: category,
                    "subCategory.name": subcategory
                },
                {
                    category: 1,
                    "subCategory.$": 1
                }
            )
            return offerDetails;
        } catch (err) {
            console.log(err)
        }
    },
    editOffer: async (category, subCategory, offer) => {
        try {
            const products = await collection.productsCollection.find(
                {
                    category: category,
                    subCategory: subCategory
                })

            let discountedPrice;
            let discountAmount;
            const updateProducts = products.map(async (product) => {
                if (product.offerPrice ===0) {
                  discountAmount = Math.round((Number(offer) / 100) * product.price);
                    discountedPrice = product.price - discountAmount;
                } else if(product.offerPrice > 0) {
                    discountAmount = Math.round((Number(offer) / 100) * product.price);
                    discountedPrice = product.offerPrice - discountAmount;
                }

                await collection.productsCollection.updateMany(
                    {
                        category: category,
                        subCategory: subCategory
                    },
                    {
                        $set: {
                            offerPrice: discountedPrice,
                        }
                    });

            })

            const updateData = await collection.categoryCollection.updateOne(
                {
                    category: category,
                    "subCategory.name": subCategory
                },
                {
                    $set: {
                        'subCategory.$.discount': offer
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