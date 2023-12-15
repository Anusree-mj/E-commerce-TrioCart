const collection = require('../../../models/index-model')
const path = require('path');

module.exports = {

    deleteMainImage: async (productId) => {
        try {
            const result = await collection.productsCollection.updateOne(
                { _id: productId },
                { $unset: { image: '' } }
            );

            if (result.modifiedCount > 0) {
                return { status: 'deleted' };
            } else {
                return { status: 'not found' };
            }
        }
        catch (err) {
            console.log(err)
            return { status: "error" }
        }
    },

    deleteAProductImage: async (image, productId) => {
        try {
            const result = await collection.productsCollection.updateOne(
                { _id: productId },
                { $pull: { detailedImages: image } }
            );

            if (result.modifiedCount > 0) {
                return { status: 'deleted' };
            } else {
                return { status: 'not found' };
            }
        }
        catch (err) {
            console.log(err)
            return { status: "error" }
        }
    },
    getProductStockForEditing: async (productId, size) => {
        try {
            const productData = await collection.productsCollection.findOne(
                {
                    _id: productId,
                    'sizesStock.size': size
                },
                {
                    name: 1,
                    category: 1,
                    subCategory: 1,
                    'sizesStock.$': 1
                }
            );
            if (productData && productData.sizesStock.length > 0) {
                const { size, count } = productData.sizesStock[0];
                return { productData, size, count };
            } else {
                console.log('no products found')
            }

            return productData
        }
        catch (err) {
            console.log(err)
        }
    },
    editStock: async (stock, size, productId) => {
        try {
            console.log('bodystock', stock, "typeof:", typeof (stock));

            const updateData = await collection.productsCollection.updateOne(
                {
                    _id: productId,
                    'sizesStock.size': size
                },
                {
                    $set: {
                        'sizesStock.$.count': stock
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