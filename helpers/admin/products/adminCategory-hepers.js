const collection = require('../../../models/index-model')
const path = require('path');

module.exports = {

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

    undoSubcategoryDelete: async (subcategory) => {
        try {
            console.log('Subcategory:', subcategory);

            await collection.productsCollection.updateMany(
                { subCategory: subcategory },
                { $set: { isDeleted: false } }
            );
            await collection.categoryCollection.updateMany(
                { "subCategory.name": subcategory },
                { $set: { "subCategory.$.isDeleted": false } }
            );
            return { status: 'undo delete' }
        }
        catch (err) {
            console.log(err)
            return { status: "error" }
        }
    },

    editSubCategory: async (body) => {
        try {
            console.log('detailsineditsubcat', body)
            const updateData = await collection.categoryCollection.updateOne(
                {
                    category: body.category,
                    subCategory: body.subcategory
                },
                {
                    $pull: {
                        subCategory: body.subcategory
                    }

                }
            )
            if (updateData) {
                console.log('collection got')
            }
            await collection.categoryCollection.updateOne(
                {
                    category: body.category,
                },
                {
                    $push: {
                        subCategory: body.newSubCategory
                    }

                }
            )

            await collection.productsCollection.updateMany(
                {
                    category: body.category,
                    subCategory: body.subcategory
                },
                {
                    $set: {
                        subCategory: body.newSubCategory
                    }
                }
            )

            return { status: 'added' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' }
        }
    },
}
