const collection = require('../routes/mongodb')
const path = require('path');

module.exports = {
    getAllProducts: async () => {
        try {
            const products = await collection.productsCollection.find().sort({ createdAt: -1 });
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

    getNewArrivalProducts: async () => {
        try {
            const category1 = await collection.productsCollection.find({ category: "Ladies", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            const category2 = await collection.productsCollection.find({ category: "Mens", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            const category3 = await collection.productsCollection.find({ category: "Kids", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            const category4 = await collection.productsCollection.find({ category: "Girls", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            return { category1, category2, category3, category4 }
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
                        size: { $in: [size] }

                    }).sort({ createdAt: -1 });

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

                    }).sort({ createdAt: -1 });

                return { categories, products }
            } else if (size && price && !query) {
                console.log('size price', size, price)
                categories = await collection.categoryCollection.findOne({
                    category: category
                })

                products = await collection.productsCollection.find(
                    {
                        category: category,
                        subCategory: subcategory,
                        isDeleted: false,
                        size: { $in: [size] },
                        price: { $lte: price }

                    }).sort({ createdAt: -1 });
                console.log('productssss', products)
                return { categories, products }
            }

        }
        catch (err) {
            console.log(err)
        }
    },

    viewAllProductsofEAchCAtegory: async (category, query) => {
        try {
            console.log('queryinfnct', query)
            let products;
            let categories;

            if (!query) {
                products = await collection.productsCollection.find(
                    { category: category, isDeleted: false }).sort({ createdAt: -1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }

            } else if (query && query === 'lowestToHighest') {
                products = await collection.productsCollection.find(
                    { category: category, isDeleted: false }).sort({ price: 1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }

            } else if (query && query === 'highestToLowest') {
                products = await collection.productsCollection.find(
                    { category: category, isDeleted: false }).sort({ price: -1 });

                categories = await collection.categoryCollection.findOne({ category: category })
                return { products, categories }

            }

            return { products, categories }
        }
        catch (err) {
            console.log(err)
        }
    },

    getAproduct: async (productId) => {
        try {
            const product = await collection.productsCollection.findOne({ _id: productId })
            return product
        } catch (err) {
            console.log(err)
        }
    },
    getSearchProduct: async (query) => {
        try {
            console.log('queryInsearchfnctn', query)
            const searchProducts = await collection.productsCollection.find({
                $or: [
                    { name: { $regex: new RegExp(query, 'i') } },
                    { category: { $regex: new RegExp(query, 'i') } },
                    { subCategory: { $regex: new RegExp(query, 'i') } },
                ],
            });

            if (searchProducts) {
                return { status: 'ok', searchProducts }
            } else {
                return { status: 'nok' }
            }

        } catch (err) {
            console.log(err)
        }
    },

    getSortedProductinAscending: async () => {
        try {
            const searchProducts = await collection.productsCollection.aggregate([
                { $sort: { price: 1 } }
            ]);

            if (searchProducts.length > 0) {
                return { status: 'ok', searchProducts };
            } else {
                return { status: 'nok' };
            }

        } catch (err) {
            console.log(err)
        }
    },
    getSortedProductinDescending: async (query) => {
        try {
            console.log('queryInsortfnctn', query)
            const searchProducts = await collection.productsCollection.aggregate([
                { $sort: { price: -1 } }
            ]);

            if (searchProducts.length > 0) {
                return { status: 'ok', searchProducts };
            } else {
                return { status: 'nok' };
            }

        } catch (err) {
            console.log(err)
        }
    },
}







