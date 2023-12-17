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
            let discountedPrice;
            let discountAmount;

            const products = await collection.productsCollection.find(
                {
                    category: category,
                    subCategory: subCategory
                }
            )
            if (offer !== '0') {
                // updating offerprice and offer in products collection
                products.map(async (product) => {
                    if (product.offerPrice === 0) {
                        discountAmount = Math.round((Number(offer) / 100) * product.price);
                        discountedPrice = product.price - discountAmount;
                    } else if (product.offerPrice > 0) {
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
                                categoryOffer: offer
                            }
                        });

                })
            } else {
                // updating offerprice and offer in products collection
                products.map(async (product) => {
                    // console.log('productoffer', product.productOffer, typeof product.productOffer)
                    if (product.productOffer === 0) {
                        discountedPrice = 0;
                    } else {
                        discountAmount = Math.round(((product.productOffer) / 100) * product.price);
                        discountedPrice = product.price - discountAmount;
                    }

                    await collection.productsCollection.updateMany(
                        {
                            category: category,
                            subCategory: subCategory
                        },
                        {
                            $set: {
                                offerPrice: discountedPrice,
                                categoryOffer: offer
                            }
                        });

                })
            }

            // updating offer in category collection
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

            // console.log('updated data is :::', updateData)
            if (updateData.modifiedCount === 1) {
                console.log('modified count', updateData.modifiedCount);
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }
    },
}
