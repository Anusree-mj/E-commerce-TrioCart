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

    editStock: async (body, productId) => {
        try {
            console.log('bodystock', body.stock, "typeof:", typeof (body.stock));

            if (body.stock === '0') {
                await collection.productsCollection.updateOne(
                    {
                        _id: productId
                    },
                    {
                        $set: { isDeleted: true }
                    })
            }

            const updateData = await collection.productsCollection.updateOne(
                { _id: productId },
                {
                    $set: {
                        stock: body.stock,
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