const collection = require('../../../models/index-model')


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

    deleteSubcategory: async (subcategory, category) => {
        try {

            await collection.productsCollection.updateMany(
                {
                    category: category,
                    subCategory: subcategory
                },
                { $set: { isDeleted: true } }
            );
            await collection.categoryCollection.updateMany(
                {
                    category: category,
                    "subCategory.name": subcategory
                },
                { $set: { "subCategory.$.isDeleted": true } }
            );
            return { status: 'deleted' }
        }
        catch (err) {
            console.log(err)
        }
    },

    undoSubcategoryDelete: async (subcategory, category) => {
        try {
            await collection.productsCollection.updateMany(
                {
                    category: category,
                    subCategory: subcategory
                },
                { $set: { isDeleted: false } }
            );
            await collection.categoryCollection.updateMany(
                {
                    category: category,
                    "subCategory.name": subcategory
                },
                { $set: { "subCategory.$.isDeleted": false } }
            );
            return { status: 'undo delete' }
        }
        catch (err) {
            console.log(err)
        }
    },

    editSubCategory: async (body) => {
        try {
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
