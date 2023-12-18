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
            const products = await collection.productsCollection.find({
                category: category,
                subCategory: subCategory
            });
    
       
            for (const product of products) {
                let discountedPrice;
                let discountAmount;
    
                if (offer !== '0') {
                    if (product.offerPrice === 0) {
                        discountAmount = Math.round((Number(offer) / 100) * product.price);
                        discountedPrice = product.price - discountAmount;
                    } else if (product.offerPrice > 0) {
                        discountAmount = Math.round((Number(offer) / 100) * product.price);
                        discountedPrice = product.offerPrice - discountAmount;
                    }
                } else {
                    if (product.productOffer === 0) {
                        discountedPrice = 0;
                    } else {
                        discountAmount = Math.round((product.productOffer / 100) * product.price);
                        discountedPrice = product.price - discountAmount;
                    }
                }
                  // updating each products offer prize and categoryOffer
                await collection.productsCollection.updateOne(
                    {
                        _id: product._id
                    },
                    {
                        $set: {
                            offerPrice: discountedPrice,
                            categoryOffer: offer
                        }
                    }
                );
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
                }
            );
    
            if (updateData.modifiedCount === 1) {
                console.log('modified count', updateData.modifiedCount);
                console.log('Data update success');
                return { status: 'ok' };
            } else {
                return { status: 'nok' };
            }
        } catch (err) {
            console.log('error occurred', err);
            return { status: 'nok' };
        }
    },
    
}
