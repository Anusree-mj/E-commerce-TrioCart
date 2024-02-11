const collection = require('../../../models/index-model')

module.exports = {

    getSearchProduct: async (query) => {
        try {
            const searchProducts = await collection.productsCollection.find({
                $or: [
                    { name: { $regex: new RegExp(query, 'i') } },
                    { category: { $regex: new RegExp(query, 'i') } },
                    { subCategory: { $regex: new RegExp(query, 'i') } },
                ],
            }).sort({ createdAt: -1 });

            if (searchProducts) {
                return { status: 'ok', searchProducts }
            } else {
                return { status: 'nok' }
            }

        } catch (err) {
            console.log(err)
        }
    },

}