const collection = require('../routes/mongodb')
const path = require('path');

module.exports = {
    addProduct: async (body, image) => {
        try {
            const imagePathWithoutPublic = path.relative('public', image.path);
            console.log('imagePathWithoutPublic:', imagePathWithoutPublic);
            // const detailedImagesWithoutPublic = files.detailedImages.map(image => {
            //     const { path, ...rest } = image;
            //     return rest;
            // });
            // console.log("detailedImagesWithoutPublic:", detailedImagesWithoutPublic);
            const data = {
                name: body.name,
                description: body.description,
                detailed_description: body.detailed_description,
                category: body.category,
                subCategory: body.subCategory,
                price: body.price,
                size: body.size,
                image: imagePathWithoutPublic
                // detailedImages: detailedImagesWithoutPublic
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
                return {status:'added'}
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
    getAllCategories: async () => {
        try {
            const categories = await collection.categoryCollection.find();
            return (categories)
        } catch (err) {
            console.log(err)
        }
    },
    deleteAProduct: async (productId) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $set: { isDeleted: true }, $unset: { _id: 1 } }, { multi: true }
            );
            return { status: 'deleted' }
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
                        image: imagePathWithoutPublic,
                        isDeleted: body.isDeleted
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

    },
    getNewArrivalProducts: async () => {
        try {
            const category1 = await collection.productsCollection.find({ category: "Ladies", isDeleted: false }).limit(4);
            const category2 = await collection.productsCollection.find({ category: "Mens", isDeleted: false }).limit(4);
            const category3 = await collection.productsCollection.find({ category: "Kids", isDeleted: false }).limit(4);
            const category4 = await collection.productsCollection.find({ category: "Girls", isDeleted: false }).limit(4);
            return { category1, category2, category3, category4 }
        }
        catch (err) {
            console.log(err)
        }
    },
    viewEachSubcategoryProducts: async (category, subcategory) => {
        try {
            const sideBarProduct = await collection.productsCollection.find({ category: category, isDeleted: false })
            const products = await collection.productsCollection.find({ category: category, subCategory: subcategory, isDeleted: false })
            return { sideBarProduct, products }
        }
        catch (err) {
            console.log(err)
        }
    },
    viewAllProductsofEAchCAtegory: async (category) => {
        try {
            const products = await collection.productsCollection.find({ category: category, isDeleted: false })
            return products
        }
        catch (err) {
            console.log(err)
        }
    }
}







