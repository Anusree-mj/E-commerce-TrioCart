const collection = require('../routes/mongodb')
const path = require('path');

module.exports = {
    addProduct: async (body, image) => {
        try {
            const imagePathWithoutPublic = path.relative('public', image.path);
            const data = {
                name: body.name,
                description: body.description,
                detailed_description: body.detailed_description,
                category: body.category,
                subCategory: body.subCategory,
                price: body.price,
                size: body.size,
                image: imagePathWithoutPublic
            };
            await collection.productsCollection.insertMany([data]);
            return { status: 'ok' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' }
        }
    },
    getAllProducts: async () => {
        try {
            const products = await collection.productsCollection.find()
            return (products)
        }
        catch (err) {
            console.log(err)
        }
    },
    deleteAProduct: async (productId) => {
        try {
            await collection.productsCollection.deleteOne({ _id: productId });
            return { status: 'deleted' }
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
    editProduct: async (body, image, productId) => {
        try {
            const imagePathWithoutPublic = path.relative('public', image.path);
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
                        image: imagePathWithoutPublic
                    }
                });
            if (updateData.modifiedCount === 1) {
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        } catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }

    }
}







