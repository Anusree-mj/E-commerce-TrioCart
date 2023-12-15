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
                    category:1,
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