const collection = require('../../models')

module.exports = {

    getSearchProduct: async (query) => {
        try {
            console.log('queryInsearchfnctn', query)
            const searchProducts = await collection.productsCollection.find({
                $or: [
                    { name: { $regex: new RegExp(query, 'i') } },
                    { category: { $regex: new RegExp(query, 'i') } },
                    { subCategory: { $regex: new RegExp(query, 'i') } },
                ],
            });

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