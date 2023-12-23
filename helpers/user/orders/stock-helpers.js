const collection = require('../../../models/index-model')

module.exports = {
    checkStock: async (productId, size) => {
        try {
            const check = await collection.productsCollection.findOne(
                {
                    _id: productId,
                    'sizesStock.size': size,
                },
                {
                    'sizesStock.$': 1
                }
            )
            const { count } = check.sizesStock[0];
            if (count > 5) {
                return { status: 'available' }
            }
            else if (count <= 5 && count!==0) {
                return { status: 'limited stock' }
            }
            else if (count === 0) {
                return { status: 'out of stock' }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}