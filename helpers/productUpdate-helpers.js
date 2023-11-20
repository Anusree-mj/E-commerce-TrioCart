const collection = require('../routes/mongodb')
const path = require('path');

module.exports = {
    addProduct: async (body, image, detailedImages) => {
        try {
            const imagePathWithoutPublic = path.relative('public', image.path);
            const detailedImagesPathsWithoutPublic = detailedImages.map(image => path.relative('public', image.path));
            const data = {
                name: body.name,
                description: body.description,
                detailed_description: body.detailed_description,
                category: body.category,
                subCategory: body.subCategory,
                price: body.price,
                size: body.size,
                image: imagePathWithoutPublic,
                detailedImages: detailedImagesPathsWithoutPublic
            };
            await collection.productsCollection.insertMany([data]);
            return { status: 'ok' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' }
        }
    },
    addSubCategory: async (body) => {
        try {
            await collection.categoryCollection.updateOne(
                { category: body.category },
                {
                    $push: {
                        subCategory: {
                            name: body.subCategory
                        }
                    }
                })
            return { status: 'added' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' }
        }
    },

    deleteAProduct: async (productId) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $set: { isDeleted: true }}
            );
            return { status: 'deleted' }
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

    deleteSubcategory: async (subcategory) => {
        try {
            console.log('Subcategory:', subcategory);

            await collection.productsCollection.updateMany(
                { subCategory: subcategory },
                { $set: { isDeleted: true } }
            );
            await collection.categoryCollection.updateMany(
                { "subCategory.name": subcategory },
                { $set: { "subCategory.$.isDeleted": true } }
            );
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

    editProduct: async (body, productId) => {
        try {
            const product = await collection.productsCollection.findOne({_id: productId})
            console.log('product found:',product)
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
                        isDeleted: body.isDeleted,
                    }
                });
                console.log('updated data is :::',updateData)
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