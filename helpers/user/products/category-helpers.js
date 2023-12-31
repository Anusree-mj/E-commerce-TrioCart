const collection = require('../../../models/index-model')

module.exports = {
    getCategoryDetails: async () => {
        try {
            const allCategories = await collection.categoryCollection.find()
            return allCategories
        }
        catch (err) {
            console.log(err)
        }
    },

    viewEachSubcategoryProducts: async (category, subcategory, query, size, price) => {
        try {
            let categories;
            let products;
            if (!query && !size && !price) {
                categories = await collection.categoryCollection.findOne({ category: category })
                products = await collection.productsCollection.find({ category: category, subCategory: subcategory, isDeleted: false }).sort({ createdAt: -1 });
                return { categories, products }

            } else if (query && query === 'lowestToHighest' && !size && !price) {
                categories = await collection.categoryCollection.findOne({
                    category: category
                })

                products = await collection.productsCollection.find({
                    category: category, subCategory: subcategory, isDeleted: false
                }).sort({ price: 1 });

                return { categories, products }

            } else if (query && query === 'highestToLowest' && !size && !price) {
                categories = await collection.categoryCollection.findOne({
                    category: category
                })

                products = await collection.productsCollection.find({
                    category: category, subCategory: subcategory, isDeleted: false
                }).sort({ price: -1 });

                return { categories, products }
            }
            else if (size && !query && !price) {
                categories = await collection.categoryCollection.findOne({
                    category: category
                })
                products = await collection.productsCollection.find(
                    {
                        category: category,
                        subCategory: subcategory,
                        isDeleted: false,
                        size: { $regex: new RegExp(size, 'i') }
                    })
                return { categories, products }
            } else if (!size && !query && price) {
                categories = await collection.categoryCollection.findOne({
                    category: category
                })

                products = await collection.productsCollection.find(
                    {
                        category: category,
                        subCategory: subcategory,
                        isDeleted: false,
                        price: { $lte: price }

                    }).sort({ price: 1 });

                return { categories, products }
            } else if (size && price && !query) {
                categories = await collection.categoryCollection.findOne({
                    category: category
                })

                products = await collection.productsCollection.find(
                    {
                        category: category,
                        subCategory: subcategory,
                        isDeleted: false,
                        size: { $regex: new RegExp(size, 'i') },
                        price: { $lte: price }

                    }).sort({ price: 1 });
                return { categories, products }
            }

        }
        catch (err) {
            console.log(err)
        }
    },

    viewAllProductsofEAchCAtegory: async (category, query, size, price) => {
        try {
            let products;
            let categories;

            if (!query && !size && !price) {
                products = await collection.productsCollection.find(
                    { category: category, isDeleted: false }).sort({ createdAt: -1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }

            } else if (query && query === 'lowestToHighest' && !size && !price) {
                products = await collection.productsCollection.find(
                    { category: category, isDeleted: false }).sort({ price: 1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }

            } else if (query && query === 'highestToLowest' && !size && !price) {
                products = await collection.productsCollection.find(
                    { category: category, isDeleted: false }).sort({ price: -1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }

            } else if (size && !query && !price) {
                products = await collection.productsCollection.find(
                    {
                        category: category,
                        isDeleted: false,
                        size: { $regex: new RegExp(size, 'i') }
                    })

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }
            }else if (!size && !query && price) {
                products = await collection.productsCollection.find(
                    { category: category, 
                        isDeleted: false,
                        price: { $lte: price }
                    }).sort({ price: 1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }
            }else if (size && price && !query) {
                products = await collection.productsCollection.find(
                    { category: category, 
                        isDeleted: false,
                        size: { $regex: new RegExp(size, 'i') },
                        price: { $lte: price }
                    }).sort({ price: 1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }
            }

            return { products, categories }
        }
        catch (err) {
            console.log(err)
        }
    },

}