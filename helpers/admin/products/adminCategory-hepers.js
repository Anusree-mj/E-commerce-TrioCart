const collection = require('../../../models/mongodb')
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

}