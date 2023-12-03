const collection = require('../../../models')
const path = require('path');

module.exports = {
    addProduct: async (body) => {
        try {
            const data = {
                name: body.name,
                description: body.detailed_description,
                category: body.category,
                subCategory: body.subCategory,
                price: body.price,
                size: body.size,
                stock: body.stock,
                image: body.imagePath,
                detailedImages: body.detailedImagePath
            };
            await collection.productsCollection.insertMany([data]);
            return { status: 'ok' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' }
        }
    },
    deleteAProduct: async (productId) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $set: { isDeleted: true } }
            );
            return { status: 'deleted' }
        }
        catch (err) {
            console.log(err)
            return { status: "error" }
        }
    },
    undoProductDelete: async (productId) => {
        try {
            const product = await collection.productsCollection.findOne({
                _id: productId
            })
            if (product && product.stock !== 0) {
                await collection.productsCollection.updateOne(
                    { _id: productId },
                    { $set: { isDeleted: false } }
                );
                return { status: 'undo delete' }
            } else {
                return { status: "nok" }
            }
        }
        catch (err) {
            console.log(err)
            return { status: "error" }
        }
    },
    getProductForEditing: async (productId) => {
        try {
            const productData = await collection.productsCollection.findOne({ _id: productId })
            return productData
        }
        catch (err) {
            console.log(err)
        }
    },

    editProduct: async (body, productId) => {
        try {
            const product = await collection.productsCollection.findOne({ _id: productId })
            console.log('product found:', product)
            const updateData = await collection.productsCollection.updateOne(
                { _id: productId },
                {
                    $set: {
                        name: body.name,
                        description: body.description,
                        detailed_description: body.detailed_description,
                        category: body.category,
                        subCategory: body.subCategory,
                        price: body.price,
                        size: body.size,
                        stock: body.stock,
                        image: body.imagePath,
                        detailedImages: body.detailedImagePaths
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